import { Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";
import { useState } from "react";
import dayjs from "dayjs";

type InsightsProps = {
  insights: Insight[];
  className?: string;
  onDelete?: () => void;
};

export const Insights = ({ insights, className, onDelete }: InsightsProps) => {
  const [error, setError] = useState<string>("");

  const deleteInsight = async (id: number) => {
    setError("");
    try {
      const res = await fetch(`/api/insights/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete insight");
      }
      onDelete?.();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.list}>
        {insights?.length ? (
          insights.map(({ id, text, date, brandId }) => (
            <div className={styles.insight} key={id}>
              <div className={styles["insight-meta"]}>
                <span>{brandId}</span>
                <div className={styles["insight-meta-details"]}>
                  <span>{dayjs(date).format("DD MMM YYYY HH:mm")}</span>
                  <button
                    className={styles["insight-delete"]}
                    onClick={() => deleteInsight(id)}
                    data-testid={`delete-button-${id}`}
                    type="button"
                  >
                    <Trash2Icon />
                  </button>
                </div>
              </div>
              <p className={styles["insight-content"]}>{text}</p>
            </div>
          ))
        ) : (
          <p>We have no insight!</p>
        )}
      </div>
    </div>
  );
};
