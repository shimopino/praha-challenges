const add = (function () {
  let foo = 1;
  return function () {
    foo = foo + 1;
    return foo;
  };
})();

console.log(add());
console.log(add());
console.log(add());
console.log(add());
console.log(add());

export const App = () => {
  return (
    <>
      <div>sample</div>
    </>
  );
};
