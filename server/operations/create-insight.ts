import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";

type Input = HasDBClient & {
  insight: Insight;
};

export default (input: Input): void => {
  const { brand, createdAt, text } = input.insight;

  if (brand < 0) { 
    throw new Error("Invalid brand ID");
  }

  const success = input.db.run(
    `INSERT INTO insights (brand, createdAt, text) VALUES (?, ?, ?)`,
    [
      brand,
      createdAt,
      text,
    ],
  );

  if (success !== 1) {
    throw new Error("Failed to insert insight");
  }
};
