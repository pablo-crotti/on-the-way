"use client";
import { useEffect, useState } from "react";
import { fetchPodcastEngagementStats } from "../../actions";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>([]);
  const [monthSum, setMonthSum] = useState(0);
  const [lastMonthSum, setLastMonthSum] = useState(0);

  const getPercentage = (monthSum: number, lastMonthSum: number) => {
    if (monthSum > lastMonthSum) {
      return Math.round(((monthSum - lastMonthSum) / lastMonthSum) * 100);
    } else if (monthSum < lastMonthSum) {
      return Math.round(((lastMonthSum - monthSum) / lastMonthSum) * 100);
    } else {
      return 0;
    }
  };

  useEffect(() => {
    fetchPodcastEngagementStats().then((data) => {
      setStats(data);
      setLoading(false);
      let sum = 0;
      for (const [key, value] of Object.entries(data.last30)) {
        sum += value as number;
      }

      setMonthSum(sum);


      sum = 1;
      for (const [key, value] of Object.entries(data.last60)) {
        sum += value as number;
      }

      setLastMonthSum(sum);
    });
  }, []);

  return (
    <div>
      {loading ? (
        <div className="w-full min-h-screen flex justify-center items-center">
          <img
            className="w-64 h-64"
            src="/loader/loader.gif"
            alt="Chargement..."
          />
        </div>
      ) : (
        <div className="flex justify-center md:justify-start">
          <div className="flex flex-col items-center p-4 w-max bg-white border border-gray-200 rounded-lg shadow md:flex-row  dark:border-darkbg-700 dark:bg-darkbg-800">
            {monthSum < lastMonthSum ? (
              <div className="flex flex-shrink-0 items-center justify-center bg-red-200 h-16 w-16 rounded">
                <svg
                  className="w-6 h-6 fill-current text-red-700"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            ) : (
              <div className="flex flex-shrink-0 items-center justify-center bg-green-200 h-16 w-16 rounded">
                <svg
                  className="w-6 h-6 fill-current text-green-700"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
            <div className="flex-grow flex flex-col ml-4">
              <span className="text-xl font-bold dark:text-white">{monthSum}</span>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 dark:text-gray-200">
                  Écoute des derniers 30 jours
                </span>
                <span
                  className={
                    monthSum < lastMonthSum
                      ? "text-red-500 text-sm font-semibold ml-2"
                      : "text-green-500 text-sm font-semibold ml-2"
                  }
                >
                  {monthSum < lastMonthSum ? `-` : `+`}{" "}
                  {getPercentage(monthSum, lastMonthSum)} %
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
