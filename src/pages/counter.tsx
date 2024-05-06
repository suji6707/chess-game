import { useCallback, useEffect, useState } from "react";

export default function Counter() {
  const [count, setCount] = useState<number>(0);

  const handlePlus = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  const handleMinus = useCallback(() => {
    setCount(count - 1);
  }, [count]);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={handleMinus}>-</button>
      <button onClick={handlePlus}>+</button>
    </div>
  );
}
