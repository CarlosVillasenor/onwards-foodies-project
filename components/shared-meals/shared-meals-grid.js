import classes from './shared-meals-grid.module.css';
import MealItem from './shared-meal-item';

export default function SharedMealsGrid({ meals = [] }) {
  return (
    <ul className={classes.meals}>
      {meals.map((meal) => (
        <li key={meal.id}>
          <MealItem {...meal} />
        </li>
      ))}
    </ul>
  );
}
