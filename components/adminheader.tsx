"use client";
import { usePathname } from "next/navigation";

export const AdminHeader = () => {
  const url = usePathname();
  return (
    <div className="hidden justify-end gap-4 sm:flex ">
      <a
        href="/admin/messages?page=1"
        className={
          url === "/admin/messages"
            ? "flex items-center p-2 rounded-lg text-white bg-primary group"
            : "flex items-center p-2 rounded-lg text-primary hover:text-white hover:bg-primary group"
        }
      >
        <svg
          className={
            url === "/admin/messages"
              ? "flex-shrink-0 w-5 h-5 text-white"
              : "flex-shrink-0 w-5 h-5  transition duration-75 text-primary group-hover:text-white"
          }
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
          <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
        </svg>
      </a>

      <a
        href="/admin/user"
        className={
          url === "/admin/user"
            ? "flex items-center p-2 rounded-lg text-white bg-primary group"
            : "flex items-center p-2 rounded-lg text-primary hover:text-white hover:bg-primary group"
        }
      >
        <svg
          className={
            url === "/admin/user"
              ? "flex-shrink-0 w-5 h-5 text-white"
              : "flex-shrink-0 w-5 h-5  transition duration-75 text-primary group-hover:text-white"
          }
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            clipRule="evenodd"
          />
        </svg>
      </a>
    </div>
  );
};
