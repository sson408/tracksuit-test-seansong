import { expect } from "jsr:@std/expect";
import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import type { Insight } from "$models/insight.ts";
import { withDB } from "../testing.ts";
import createInsight from "./create-insight.ts";
import listInsights from "./list-insights.ts";

describe("createInsight", () => {
  describe("when inserting a valid insight", () => {
    withDB((fixture) => {
      const now = new Date();
      const insight: Insight = {
        id: 1,
        brand: 1,
        createdAt: now,
        text: "Test insight",
      };

      beforeAll(() => {
        createInsight({ db: fixture.db, insight });
      });

      it("inserts the insight into the DB", () => {
        const result = listInsights(fixture);
        expect(result.length).toBe(1);
        const stored = result[0];
        expect(stored.text).toEqual(insight.text);
        expect(stored.brand).toEqual(insight.brand);
      });
    });
  });
  describe("when inserting an invalid insight", () => {
    withDB((fixture) => {
      const now = new Date();
      const insight: Insight = {
        id: 1,
        brand: -1, // Invalid brand ID
        createdAt: now,
        text: "Invalid insight",
      };

      it("throws an error", () => {
        expect(() => createInsight({ db: fixture.db, insight })).toThrow(
          "Invalid brand ID",
        );
      });

      it("does not insert the invalid insight into the DB", () => {
        const result = listInsights(fixture);
        expect(result.length).toBe(0);
      });
    });
  });
});
