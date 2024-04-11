"use client";

import { useState, useEffect } from "react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const getClass = (str: string) => {
    return `bg-${str.toLowerCase()}-500 text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded-full`;
  }

  const getMessages = () => {
    fetch("/api/contact", {
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


    fetch("/api/contact", {
      method: "PUT",
      body: formData,
    }).catch((error) => console.error("Error setting favorite:", error));

  }

  const deleteMessages = () => {
    fetch("/api/contact", {
      method: "DELETE",
      body: JSON.stringify(selectedMessages),
    })
      .then(() => {
        getMessages();
        setSelectedMessages([]);
      })
      .catch((error) => console.error("Error deleting messages:", error));
  }

  const handleCheckbox = (event: any) => {
    let exist = selectedMessages.find((id) => id === event.target.id);
    if (exist) {
      const updatedMessages = selectedMessages.filter((id) => id !== event.target.id);
      setSelectedMessages(updatedMessages);
    } else {
      setSelectedMessages([...selectedMessages, event.target.id]);
    }
  }

  useEffect(() => {
    getMessages();
  }, []);
  return (
    <div className="w-full h-full flex-col justify-center align-center p-4">
      <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white  mb-10">
        Messages
      </h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <button onClick={deleteMessages}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>

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

                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={message.id}>
                  <th className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" id={message.id} onChange={(event) => handleCheckbox(event)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                  </th>
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
                          strokeLinecap="round"
                          strokeLinejoin="round"
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
