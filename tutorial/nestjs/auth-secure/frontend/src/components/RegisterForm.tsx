import axios, { Axios } from "axios";
import React, { useState } from "react";

export const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/auth/register",
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      alert("ユーザー登録完了！");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.message);
        console.log(error.response?.status);
      } else {
        console.error(e);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <button type="submit">Submit</button>

      {error && <div>{error}</div>}
    </form>
  );
};
