// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * A custom hook that delays updating a value until a certain amount of time has passed
 * without that value changing. This is useful for performance-intensive operations
 * like API calls on user input.
 * @param {*} value The value to debounce (e.g., a search query).
 * @param {number} delay The debounce delay in milliseconds.
 * @returns The debounced value.
 */
function useDebounce(value, delay) {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Set up a timer that will update the debounced value after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // This is the cleanup function. It runs every time the 'value' or 'delay'
      // changes, OR before the component unmounts. It clears the previous timer,
      // effectively resetting the countdown.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-run the effect if the value or delay changes
  );

  return debouncedValue;
}

export default useDebounce;