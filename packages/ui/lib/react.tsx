import { useState, useEffect } from "react";

type InjectedReactProps = {
  initialValue?: number;
  updateValue?: (value: number) => void;
};
const InjectedReact = ({ initialValue, updateValue }: InjectedReactProps) => {
  const [value, setValue] = useState(initialValue || 0);
  useEffect(() => {
    if (!updateValue) return;
    updateValue(value);
  }, [value]);

  return (
    <>
      <div>Value: {value}</div>
      <button onClick={() => setValue(value + 1)}>Click me</button>
    </>
  );
};

export default InjectedReact;
