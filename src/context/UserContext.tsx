import { decodeJwt } from "jose";
import { createContext, useContext, useEffect, useState } from "react";

type User = { id: number; full_name: string; canEdit: boolean };
type UserContextProps = { user: User | null };

const UserContext = createContext<UserContextProps>({ user: null });

const useUser = () => useContext(UserContext);

function UserProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token == null) return;

    const user: User = decodeJwt(token);
    user.canEdit = false;
    setUser(user);
  }, []);
  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
}

export { UserProvider, useUser, type User };
