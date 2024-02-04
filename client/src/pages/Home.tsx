import { Navigate } from "react-router-dom";
// import { Hero } from "../components/Hero.tsx";
import { useUser } from "../hooks/useUser";

export const Home = () => {
  const user = useUser();

  if (user) return <Navigate to="/videos" />;
  return <div>hero page</div>;
};
