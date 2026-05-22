'use client';

import { useFormStatus } from 'react-dom';

export default function MealsFormSubmit() {
  // useFormStatus is a React hook that allows you to track the status of a form submission.
  // It returns an object with a pending property that indicates whether the form is currently being submitted.
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Share Meal'}
    </button>
  );
}
