import { useState } from "react";
import { Check } from "./components/Check";
import { RegisterForm } from "./components/RegisterForm";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <p>サンプルとして表示する内容</p>
      </header>
      <main>
        <h2>ユーザー登録</h2>
        <RegisterForm />

        <h2>チェック</h2>
        <Check />
      </main>
    </div>
  );
}

export default App;
