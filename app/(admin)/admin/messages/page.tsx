"use client";

import { useState, useEffect } from "react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);

    const getClass = (str: string) => {
        return `bg-${str.toLowerCase()}-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full`;
    }

    const getMessages = () => {
        fetch(`${process.env.NEXTAUTH_URL}/api/contact`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => {
            setMessages(data);
          })
          .catch((error) => console.error("Error fetching messages:", error));
    }

    const setFav = (id: String, favorite: boolean) => {
        const formData = new FormData();
        formData.append("id", id.toString());
        formData.append("favorite", favorite ? "false" : "true");
        

        fetch(`${process.env.NEXTAUTH_URL}/api/contact`, {
            method: "PUT",
            body: formData,
        }).catch((error) => console.error("Error setting favorite:", error));
        
    }

    getMessages();
  return (
    <div className="w-full h-full flex-col justify-center align-center p-4">
      <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white  mb-10">
        Messages
      </h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
              <span className="sr-only">Select</span>

              </th>
              <th scope="col" className="px-6 py-3">
                Catégorie
              </th>
              <th scope="col" className="px-6 py-3">
                Expéditeur
              </th>
              <th scope="col" className="px-6 py-3">
                Objet
              </th>
              <th scope="col" className="px-6 py-3">
                Message
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Favorite</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {messages.map(
              (message: {
                id: string;
                sender: string;
                category: string;
                text: string;
                object: string;
                isFavorite: boolean;
              }) => (
                
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4">Select</td>
                  <th
                    scope="row"
                    className="px-6 lowercase py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <span className={getClass(message.category)}>{message.category}</span>
                    
                  </th>
                  <td className="px-6 py-4">{message.sender}</td>
                  <td className="px-6 py-4">{message.object}</td>
                  <td className="px-6 py-4">{message.text}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setFav(message.id, message.isFavorite)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={message.isFavorite ? "currentColor" : "none"}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>
                    </button>
                  </td>
                  
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
