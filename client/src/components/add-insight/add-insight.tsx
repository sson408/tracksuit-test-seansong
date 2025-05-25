import { type FormEvent, useState } from "react";
import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";
import { useAddInsight } from "../../hooks/useAddInsight.ts";

type AddInsightProps = ModalProps & {
  onSuccess?: () => void;
};

export const AddInsight = (props: AddInsightProps) => {
  const { brandId, setBrandId, text, setText, error, loading, addInsight } =
    useAddInsight();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addInsight(() => {
      props.onClose();
      props.onSuccess?.();
    });
  };

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
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
