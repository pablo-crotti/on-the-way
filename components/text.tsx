import { ReactNode } from "react";

export const Text = ({ children }: { children: ReactNode }) => {
  return <p className="text-base text-center sm:text-left text-gray-900 dark:text-white">{children}</p>;
};
