import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AuthLayout = ({ children }: Props) => (
  <main className="min-h-screen flex flex-col bg-mist">{children}</main>
);

export default AuthLayout;
