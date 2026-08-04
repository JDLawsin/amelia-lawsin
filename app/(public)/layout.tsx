import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/** Pass-through wrapper; route groups (site) and (legal) supply their own chrome. */
const PublicLayout = ({ children }: Props) => children;

export default PublicLayout;
