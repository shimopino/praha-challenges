import axios from "axios";
import React, { useState } from "react";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post(
        "/auth/login",
        {
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

      alert("ログイン成功");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.message);
        console.log(error.response?.status);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        type="text"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
