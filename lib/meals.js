import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import fs from 'node:fs';
import { S3 } from '@aws-sdk/client-s3';

const s3 = new S3({
  region: 'us-east-2'
});

const db = sql('meals.db');

export async function getAllMeals() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // throw new Error('Failed to fetch meals!');

  return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(mealSlug) {
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(mealSlug);
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

  // Insert the meal data into the database
  db.prepare(
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
  `
  ).run(meal);
}
