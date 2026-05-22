'use client';

import classes from './page.module.css';
import ImagePicker from '@/components/shared-meals/image-picker';
import { shareMealHandler } from '@/lib/action';
import MealsFormSubmit from '@/components/shared-meals/meals-form-submit';
import React from 'react';

export default function ShareMealPage() {
  // useActionState is a React hook that allows you to manage state in an action handler.
  // It returns an array with two elements: the current state and a function to update the state.
  const [state, formAction] = React.useActionState(shareMealHandler, { message: null });

  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={classes.main}>
        <form className={classes.form} action={formAction}>
          <div className={classes.row}>
            <p>
              <label htmlFor="name">Your name</label>
              <input type="text" id="name" name="name" required />
            </p>
            <p>
              <label htmlFor="email">Your email</label>
              <input type="email" id="email" name="email" required />
            </p>
          </div>
          <p>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" required />
          </p>
          <p>
            <label htmlFor="summary">Short Summary</label>
            <input type="text" id="summary" name="summary" required />
          </p>
          <p>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              rows="10"
              required
            ></textarea>
          </p>
          <ImagePicker label="Meal Image" name="image" />
          {state.message && <p className={classes.error}>{state.message}</p>}
          <p className={classes.actions}>
            <MealsFormSubmit />
          </p>
        </form>
      </main>
    </>
  );
}
