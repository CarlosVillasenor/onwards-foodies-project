import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import { S3 } from '@aws-sdk/client-s3';
import { createClient } from "@libsql/client";

const s3 = new S3({
  region: 'us-east-2'
});

// const db = sql('meals.db');

export async function getDatabaseClient() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

export async function getAllMeals() {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  // return db.prepare('SELECT * FROM meals').all();
  const client = await getDatabaseClient();
  const meals = await client.execute('SELECT * FROM meals');
  return meals.rows;
}

export async function getMeal(mealSlug) {
  const client = await getDatabaseClient();
  const meal = await client.execute('SELECT * FROM meals WHERE slug = ?', [mealSlug]);
  return meal.rows[0];

  // return db.prepare('SELECT * FROM meals WHERE slug = ?').get(mealSlug);
}

export async function saveMeal(meal) {
  // Set the slug based on the title
  meal.slug = slugify(meal.title, { lower: true });
  // Sanitize the instructions to prevent XSS attacks
  meal.instructions = xss(meal.instructions);
  // Validate the uploaded image file  
  if (!meal.image || typeof meal.image !== 'object' || typeof meal.image.arrayBuffer !== 'function') {
    throw new Error('Invalid image upload');
  }

  // Set the file extension based on the original file name
  const extension = meal.image.name.split('.').pop();
  // Create a unique file name using the meal slug and current timestamp
  const fileName = `${meal.slug}.${extension}`;
  // Convert the uploaded file to a buffer
  const bufferedImage = await meal.image.arrayBuffer();

  // Upload the image to S3
  s3.putObject({
    Bucket: 'carlos-nextjs-demo-users-image',
    Key: fileName,
    Body: Buffer.from(bufferedImage),
    ContentType: meal.image.type,
  });

  // Set the image path in the meal data to be stored in the database
  meal.image = fileName;

  // // Insert the meal data into the database
  // db.prepare(
  //   `
  //   INSERT INTO meals
  //     (title, summary, instructions, creator, creator_email, image, slug)
  //   VALUES (
  //     @title,
  //     @summary,
  //     @instructions,
  //     @creator,
  //     @creator_email,
  //     @image,
  //     @slug
  //   )
  // `
  // ).run(meal);
  const client = await getDatabaseClient();
  await client.execute(
    `
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (
      @title,
      @summary,
      @instructions,
      @creator,
      @creator_email,
      @image,
      @slug
    )
  `,
    meal
  );
}
