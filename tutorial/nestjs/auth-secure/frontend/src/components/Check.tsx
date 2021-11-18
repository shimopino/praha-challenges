import axios from "axios";

export const Check = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.get("http://localhost:8080/auth/me", {
        withCredentials: true,
      });

      alert("Cookieの検証OK！");
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
      <button type="submit">Submit</button>
    </form>
  );
};
