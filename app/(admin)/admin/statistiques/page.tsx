"use client";
import { Title } from "@/components/title";
import { useEffect, useState } from "react";
import { Donut, LineChart, VerticalBar } from "@/components/charts";
import { fetchPodcastStats } from "../../../actions";

/**
 * `StatsPage` component displays various analytics and statistics related to podcasts.
 * It visualizes country, referrer, and device statistics using charts, and adjusts the data range
 * based on a user-selected time interval. The component fetches data from a custom analytics API.
 *
 * @component
 * @example
 * return (
 *   <StatsPage />
 * )
 */
export default function StatsPage() {
  const [countryStats, setCountryStats] = useState<any[]>([]);
  const [referrerStats, setReferrerStats] = useState<any[]>([]);
  const [deviceStats, setDeviceStats] = useState<any[]>([]);
  const [interval, setInterval] = useState<number>(1);
  const [podcastStats, setPodcastStats] = useState<any>({});

  /**
   * Fetches analytics data from a specified category and updates state through a callback.
   * The data range is determined by the interval, calculating dates from the current time.
   *
   * @param {string} category - The category of data to fetch (e.g., 'country', 'referrer', 'os_name').
   * @param {number} interval - The time range in milliseconds from the current date to fetch data.
   * @param {Function} callback - The function to update state with the fetched data.
   */
  const getStats = (
    category: string,
    interval: number,
    callback: any
  ): void => {
    const toDateTime = new Date();
    const fromDateTime = new Date(toDateTime.getTime() - interval);
    fetch(
      `/api/analytics?category=${category}&from=${encodeURIComponent(
        fromDateTime.toISOString()
      )}&to=${encodeURIComponent(toDateTime.toISOString())}`,
      { method: "GET" }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (!data || !data.data) {
          throw new Error("Data is undefined or empty");
        }
        const tab = Array.from(data.data);
        callback(tab);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  /**
   * Fetches and updates the state with podcast audience statistics using a specified interval.
   * This function uses an imported `fetchPodcastStats` function which should also be documented.
   */
  const getPodcastAudience = () => {
    fetchPodcastStats(interval).then((data) => {
      setPodcastStats(data);
    });
  };

  // useEffect hook to load data on component mount and update on interval changes
  useEffect(() => {
    getStats("country", 1000 * 60 * 60 * 24 * interval, setCountryStats);
    getStats("referrer", 1000 * 60 * 60 * 24 * interval, setReferrerStats);
    getStats("os_name", 1000 * 60 * 60 * 24 * interval, setDeviceStats);
    getPodcastAudience();
  }, [interval]);
  return (
    <div>
      <Title type="h1" children="Statistiques" />
      <select
        name="sorting"
        value={interval}
        onChange={(e) => {
          setInterval(+e.target.value);
        }}
        className="ml-10 mb-10 bg-white dark:bg-darkbg-800 text-darkbg-900 dark:text-white rounded-lg focus:ring-primary focus:border-primary"
      >
        <option value="1">Dernières 24h</option>
        <option value="7">7 derniers jours</option>
        <option value="30">30 derniers jours</option>
      </select>
      <div className="flex flex-row flex-wrap gap-12 justify-center">
        <Donut data={countryStats} title="Visiteurs par pays" type="donut" />
        <Donut data={deviceStats} title="Visiteurs par appareil" type="pie" />
        <VerticalBar data={referrerStats} title="Visiteurs par source" />
        <LineChart data={podcastStats} title="Auditeurs" />
      </div>
    </div>
  );
}
