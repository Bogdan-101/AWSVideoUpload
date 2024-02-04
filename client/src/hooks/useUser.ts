interface User {
  id: string;
  name: string;
}

const decodeToken = <T extends object>(token: string): T => {
  const body = token.split(".")[1];
  return JSON.parse(atob(body)) as T;
};

export const useUser = (): User | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return decodeToken<User>(token);
};
