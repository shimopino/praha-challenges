function useState<T>(initialValue: T): [() => T, (newVal: T) => void] {
  let _val = initialValue;
  const state = () => _val;
  const setState = (newVal: T): void => {
    _val = newVal;
  };

  return [state, setState];
}

export const App = () => {
  const [count, setCount] = useState(1);

  console.log(count());
  setCount(2);
  console.log(count());

  return (
    <>
      <div>sample</div>
    </>
  );
};
