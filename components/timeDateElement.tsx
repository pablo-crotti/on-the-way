"use client";

export default function TimeDateElement() {
  const setDate = () => {
    const date = new Date();
    const dateString = date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const firstLetter = dateString.charAt(0).toUpperCase();
    const remainingLetters = dateString.slice(1);
    const newDateString = firstLetter + remainingLetters;
    return newDateString;
  };

  const setTime = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeString =
      (hours < 10 ? "0" : "") +
      hours +
      ":" +
      (minutes < 10 ? "0" : "") +
      minutes;
    return timeString;
  };

  return (
    <div>
      <p className="text-center">{setDate()}</p>
      <p className="font-semibold text-center">{setTime()}</p>
    </div>
  );
}
