import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import type { Insight } from "../schemas/insight.ts";
import { transformFromApi } from "../utils/transformFromApi.ts";
import type { InsightFromApi } from "../types/insight.ts";

export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/insights");
      //console.log("Response", response);
      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }
      const dataList = await response.json();
      //console.log("DataList", dataList);

      if (!Array.isArray(dataList)) {
        throw new Error("Invalid response format: expected an array");
      }
      if (!dataList || dataList.length === 0) {
        throw new Error("No insights found");
      }

      const transformedInsights = dataList.map((data: InsightFromApi) =>
        transformFromApi(data)
      );

      setInsights(transformedInsights);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching insights:", error.message);
      } else {
        console.error("Unknown error fetching insights:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <main className={styles.main}>
      <Header onSuccess={fetchInsights} />
      {loading ? (
        <p>Loading insights...</p>
      ) : (
        <Insights className={styles.insights} insights={insights} />
      )}
    </main>
  );
};
