import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export const AdminNav = () => {
  const url = usePathname();
  return (
    <div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-secondary dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          // aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-secondary">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/admin"
                className={
                  url === "/admin"
                    ? "flex items-center p-2 rounded-lg text-white bg-primary group"
                    : "flex items-center p-2 rounded-lg text-primary hover:text-white hover:bg-primary group"
                }
              >
                <svg
                  className={
                    url === "/admin"
                      ? "flex-shrink-0 w-5 h-5 text-white"
                      : "flex-shrink-0 w-5 h-5  transition duration-75 text-primary group-hover:text-white"
                  }
                  // ariaHidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Panneau de contrôle
                </span>
              </a>
            </li>

            <li>
              <a
                href="/admin/episodes"
                className={
                  url === "/admin/episodes"
                    ? "flex items-center p-2 rounded-lg text-white bg-primary group"
                    : "flex items-center p-2 rounded-lg text-primary hover:text-white hover:bg-primary group"
                }
              >
                <svg
                  className={
                    url === "/admin/episodes"
                      ? "flex-shrink-0 w-5 h-5 text-white"
                      : "flex-shrink-0 w-5 h-5  transition duration-75 text-primary group-hover:text-white"
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                  <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                </svg>
                <span className="ms-3">Podcasts</span>
              </a>
            </li>

            <li>
              <a
                href="/admin/new"
                className={
                  url === "/admin/new"
                    ? "flex items-center p-2 rounded-lg text-white bg-primary group"
                    : "flex items-center p-2 rounded-lg text-primary hover:text-white hover:bg-primary group"
                }
              >
                <svg
                  className={
                    url === "/admin/new"
                      ? "flex-shrink-0 w-5 h-5 text-white"
                      : "flex-shrink-0 w-5 h-5  transition duration-75 text-primary group-hover:text-white"
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ms-3">Publier un épisode</span>
              </a>
            </li>

            <li>
              <a
                href="#"
                className={
                  url === "/admin/statistiques"
                    ? "flex items-center p-2 rounded-lg text-white bg-primary group"
                    : "flex items-center p-2 rounded-lg text-primary hover:text-white hover:bg-primary group"
                }
              >
                <svg
                  className={
                    url === "/admin/statistiques"
                      ? "flex-shrink-0 w-5 h-5 text-white"
                      : "flex-shrink-0 w-5 h-5  transition duration-75 text-primary group-hover:text-white"
                  }
                  // aria-hidden="true"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">Statistiques</span>
              </a>
            </li>

            <li className="sm:hidden">
              <a
                href="/admin/messages"
                className={
                  url === "/admin/messages"
                    ? "flex-shrink-0 w-5 h-5 text-white"
                    : "flex-shrink-0 w-5 h-5  transition duration-75 text-primary group-hover:text-white"
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
                <span className="ms-3">Messages</span>
              </a>
            </li>

            <li className="sm:hidden">
              <a
                href="/admin/user"
                className={
                  url === "/admin/user"
                    ? "flex-shrink-0 w-5 h-5 text-white"
                    : "flex-shrink-0 w-5 h-5  transition duration-75 text-primary group-hover:text-white"
                }
              >
                <svg
                  className={
                    url === "/admin/user"
                      ? "flex items-center p-2 rounded-lg text-white bg-primary group"
                      : "flex items-center p-2 rounded-lg text-primary hover:text-white hover:bg-primary group"
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
                <span className="ms-3">Utilisateur</span>
              </a>
            </li>

            <li>
              <div className="flex items-center p-2 rounded-lg text-primary hover:text-white hover:bg-primary group">
                <button
                  className="flex items-center p-2text-white"
                  onClick={() => signOut()}
                >
                  <svg
                    className="flex-shrink-0 w-5 h-5  transition duration-75 text-primary group-hover:text-white"
                    // aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                    />
                  </svg>
                  <span className="flex-1  ms-3 whitespace-nowrap">
                    Déconnexion
                  </span>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};
