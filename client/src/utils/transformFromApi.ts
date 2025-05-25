import type { Insight } from "../schemas/insight.ts";
import type { InsightFromApi } from "../types/insight.ts";
1
export const transformFromApi = (insight: InsightFromApi): Insight => {
  return {
    id: insight.id,
    brandId: insight.brand,
    text: insight.text,
    date: new Date(insight.createdAt),
  };
};
