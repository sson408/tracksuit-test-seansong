import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";

type Input = HasDBClient & {
  id: number;
};

export default (input: Input): void => {
  const success = input.db.run(
    `DELETE FROM insights WHERE id = ?`,
    [input.id],
  );

  if (success !== 1) {
    throw new Error("Failed to delete insight");
  }
};
