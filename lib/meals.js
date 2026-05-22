import slugify from 'slugify';
import xss from 'xss';
import { S3 } from '@aws-sdk/client-s3';
import { createClient } from "@libsql/client";

const s3 = new S3({
  region: 'us-east-2'
});

export function getDatabaseClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) throw new Error("Missing TURSO_DATABASE_URL");
  if (!authToken) throw new Error("Missing TURSO_AUTH_TOKEN");

  return createClient({
    url,
    authToken,
  });
}

export async function getAllMeals() {
  const client = getDatabaseClient();
  const meals = await client.execute('SELECT * FROM meals');
  return meals.rows;
}

export async function getMeal(mealSlug) {
  const client = getDatabaseClient();

  const meal = await client.execute({
    sql: 'SELECT * FROM meals WHERE slug = ?',
    args: [mealSlug],
  });

  return meal.rows[0];
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

  const client = getDatabaseClient();
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
