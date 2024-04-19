import { ReactNode } from "react";

export const Text = ({ children }: { children: ReactNode }) => {
  return <p className="text-base text-center text-darkbg-900 dark:text-white">{children}</p>;
};
