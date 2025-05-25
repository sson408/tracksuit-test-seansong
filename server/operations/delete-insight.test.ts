import { expect } from "jsr:@std/expect";
import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import type { Insight } from "$models/insight.ts";
import { withDB } from "../testing.ts";
import createInsight from "./create-insight.ts";
import deleteInsight from "./delete-insight.ts";
import listInsights from "./list-insights.ts";

describe("deleteInsight", () => {
  describe("when deleting an existing insight", () => {
    withDB((fixture) => {
      const insight: Insight = {
        id: 1,
        brand: 1,
        createdAt: new Date(),
        text: "Insight to delete",
      };

      beforeAll(() => {
        createInsight({ db: fixture.db, insight });
        deleteInsight({ db: fixture.db, id: insight.id });
      });

      it("removes the insight from the DB", () => {
        const result = listInsights(fixture);
        expect(result.length).toBe(0);
      });
    });
  });

  describe("when deleting a non-existent insight", () => {
    withDB((fixture) => {
      it("throws an error", () => {
        expect(() => deleteInsight({ db: fixture.db, id: 999 }))
          .toThrow("Failed to delete insight");
      });
    });
  });
});
