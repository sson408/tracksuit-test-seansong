import { type FormEvent, useState } from "react";
import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";

type AddInsightProps = ModalProps & {
  onSuccess?: () => void;
};

export const AddInsight = (props: AddInsightProps) => {
  const [brandId, setBrandId] = useState(BRANDS[0].id); //default to brand 1
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addInsight = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      props.onClose();
      props.onSuccess?.();
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
  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form} onSubmit={addInsight}>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <label className={styles.field}>
          <select
            className={styles.fieldInput}
            value={brandId}
            onChange={(e) => setBrandId(Number(e.target.value))}
          >
            {BRANDS.map(({ id, name }) => (
              <option value={id} key={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Insight
          <textarea
            className={styles["field-input"]}
            rows={5}
            placeholder="Something insightful..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <Button
          className={styles.submit}
          disabled={loading}
          type="submit"
          label={loading ? "Adding..." : "Add insight"}
        />
      </form>
    </Modal>
  );
};
