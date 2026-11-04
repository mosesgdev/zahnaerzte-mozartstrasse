"use client";

/** Submit button that asks for confirmation first (e.g. before deleting). */
export function ConfirmSubmitButton({
  question,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { question: string }) {
  return (
    <button
      type="submit"
      {...props}
      onClick={(event) => {
        if (!window.confirm(question)) event.preventDefault();
      }}
    />
  );
}
