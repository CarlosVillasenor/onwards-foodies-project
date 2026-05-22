import SharedMealsGrid from '@/components/shared-meals/shared-meals-grid';
import classes from './page.module.css';
import Link from 'next/link';
import { getAllMeals } from '@/lib/meals';
import { Suspense } from 'react';
import MealsLoadingPage from './loading-out';

export const metadata = {
  title: 'All Meals - NextLevel Food',
  description: 'Browse delicious meals shared by our food-loving community.',
};

async function Meals() {
  const meals = await getAllMeals();

  if (meals.length === 0) {
    return <p className={classes['no-meals']}>No meals found. Maybe share one?</p>
  }

  return (<SharedMealsGrid meals={meals} />);
}

export default function MealsPage() {
  return (
    <>
      <header className={classes.header}>
        <h1>
          Delicious meals, created <span className={classes.highlight}>by you</span>
        </h1>
        <p>Choose your favorite recipe and cook it yourself. It is easy and fun!</p>
        <p className={classes.cta}>
          <Link href="/meals/share">
            Share Your Favorite Recipe
          </Link>
        </p>
      </header>
      <main className={classes.main}>
        <Suspense fallback={<MealsLoadingPage />}>
          <Meals />
        </Suspense>
      </main>
    </>
  );
}
