import { useState } from "react";

type FunctionalComponentProps = {
  initial: number;
  min: number;
  max: number;
};

export const FunctionalComponent = ({
  initial = 0,
  min = 0,
  max = 10,
}: FunctionalComponentProps) => {
  const [count, setCount] = useState(initial);

  const increment = () => {
    if (count < max) {
      setCount((prev) => prev + 1);
    }
  };
  const decrement = () => {
    if (count > min) {
      setCount((prev) => prev - 1);
    }
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
    </div>
  );
};
