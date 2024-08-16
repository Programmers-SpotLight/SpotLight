import { createContext, useContext, ReactNode } from "react";

interface UserPageContextProps {
  isMyPage: boolean;
}

const UserPageContext = createContext<UserPageContextProps | undefined>(
  undefined
);

export const UserPageProvider = ({
  children,
  isMyPage
}: {
  children: ReactNode;
  isMyPage: boolean;
}) => {
  return (
    <UserPageContext.Provider value={{ isMyPage }}>
      {children}
    </UserPageContext.Provider>
  );
};

export const useUserPage = () => {
  const context = useContext(UserPageContext);
  if (!context) {
    throw new Error("useUserPage must be used within a UserPageProvider");
  }
  return context;
};
