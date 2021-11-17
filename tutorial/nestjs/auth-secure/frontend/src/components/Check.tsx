import axios from "axios";

export const Check = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      axios.get("http://localhost:8080/auth/me", {
        withCredentials: true,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log(e.message);
      }
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
};
