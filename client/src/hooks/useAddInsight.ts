import { useState } from "react";


export const useAddInsight = () => {
  const [brandId, setBrandId] = useState<number>(1); // default to brand 1
  const [text, setText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const addInsight = async (onSuccess?: () => void) => {
    if (!text.trim()) {
      setError("Please enter an insight");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const payload = {
        brand: brandId,
        text,
        createdAt: new Date().toISOString(),
      };
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to add insight");
      }
      setText("");
      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { brandId, setBrandId, text, setText, error, loading, addInsight };
}