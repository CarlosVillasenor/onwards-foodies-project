'use server';

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

function isInvalidTextInput(text) {
  return !text || text.trim().length === 0;
}

export async function shareMealHandler(prevState, formData) {
  // Extract form data into a structured object
  const mealData = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: formData.get('image'),
    creator: formData.get('name'),
    creator_email: formData.get('email'),
  };

  // Validate input
  if (isInvalidTextInput(mealData.title) ||
    isInvalidTextInput(mealData.summary) ||
    isInvalidTextInput(mealData.instructions) ||
    isInvalidTextInput(mealData.creator) ||
    isInvalidTextInput(mealData.creator_email) ||
    mealData.creator_email.indexOf('@') === -1 ||
    !mealData.image || mealData.image.size === 0) {
    // Return an error message if validation fails
    return {
      message: 'Invalid input. Please fill in all fields and provide a valid image.',
    }
  }

  // Save the meal data to the database
  await saveMeal(mealData);
  // Revalidate the meals page to reflect the new meal
  revalidatePath('/meals');
  // redirect the user to the meals page after sharing the meal
  redirect('/meals');
}


