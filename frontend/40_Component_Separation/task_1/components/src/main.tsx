import React, { Component, useState } from "react";
import ReactDOM from "react-dom";

import { FunctionalComponent } from "./functional";
import { ClassComponent } from "./class";

const App = () => {
  return (
    <div>
      <h1>Functional Component</h1>
      <FunctionalComponent initial={0} min={0} max={10} />

      <br />

      <h1>Class Component</h1>
      <ClassComponent initial={0} min={0} max={10} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
