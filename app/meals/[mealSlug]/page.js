import classes from './page.module.css';
import Image from 'next/image';
import { getMeal } from '@/lib/meals';
import { notFound } from 'next/navigation';

// Generate dynamic metadata (page title and description) for SEO
// This function runs on the server and updates the page's meta tags based on the meal data
export async function generateMetadata({ params }) {
  // Extract the meal slug from the URL parameters
  const { mealSlug } = await params;
  // Fetch the meal data from the database using the slug
  const meal = await getMeal(mealSlug);

  // If meal is not found, trigger a 404 page
  if (!meal) {
    notFound();
  }

  // Return metadata object with the meal's title and summary
  return {
    title: meal.title,
    description: meal.summary
  };
}

// Main page component that displays detailed information about a specific meal
// This is a dynamic route component that renders based on the [mealSlug] parameter
export default async function MealDetailsPage({ params }) {
  // Extract the meal slug from the URL parameters
  const { mealSlug } = await params;
  // Fetch the meal data from the database using the slug
  const meal = await getMeal(mealSlug);

  // If meal is not found, trigger a 404 page not found
  if (!meal) {
    notFound();
  }

  // Convert newline characters in instructions to HTML <br /> tags for proper formatting
  meal.instructions = meal.instructions.replaceAll('\n', '<br />');

  // Render the meal details page with header and main content sections
  return (
    <>
      {/* Header section displaying meal image, title, creator, and summary */}
      <header className={classes.header}>
        {/* Container for the meal image */}
        <div className={classes.image}>
          {/* Optimized Next.js Image component fetched from AWS S3 bucket */}
          <Image
            src={`https://carlos-nextjs-demo-users-image.s3.amazonaws.com/${meal.image}`}
            alt={meal.title}
            fill
          />
        </ div>
        {/* Container for the meal information text */}
        <div className={classes.headerText}>
          {/* Display the meal title */}
          <h1>{meal.title}</h1>
          {/* Display the creator's name with a clickable email link */}
          <p className={classes.creator}>
            By <a href={`mailto: ${meal.creator_email}`}>{meal.creator}</a>
          </p>
          {/* Display a brief summary of the meal */}
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      {/* Main content section displaying cooking instructions */}
      <main>
        {/* Instructions rendered as HTML to preserve line breaks and formatting */}
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{
            __html: meal.instructions
          }}></p>
      </main>
    </>
  );
}
