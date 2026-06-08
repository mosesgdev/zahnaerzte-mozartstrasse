"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  createVacationAction,
  type VacationFormState,
} from "@/app/admin/actions";
import { vertretungen } from "@content/vertretungen";
import { Button } from "@/components/ui/button";

const initialState: VacationFormState = {};

const fieldClass =
  "w-full rounded-lg bg-surface-container px-4 py-3 text-base text-foreground outline-none ring-1 ring-outline-variant/40 focus:ring-2 focus:ring-primary transition";
const labelClass =
  "block text-sm font-medium text-on-surface-variant mb-1.5";

export function VacationForm() {
  const [state, action, pending] = useActionState(
    createVacationAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [replacementId, setReplacementId] = useState("");
  const isOther = replacementId === "andere";

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setReplacementId("");
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={action} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="start" className={labelClass}>
            Von
          </label>
          <input id="start" name="start" type="date" required className={fieldClass} />
        </div>
        <div>
          <label htmlFor="end" className={labelClass}>
            Bis
          </label>
          <input id="end" name="end" type="date" required className={fieldClass} />
        </div>
      </div>

      <div>
        <label htmlFor="replacementId" className={labelClass}>
          Vertretung (Praxis / Zahnarzt)
        </label>
        <select
          id="replacementId"
          name="replacementId"
          required
          value={replacementId}
          onChange={(e) => setReplacementId(e.target.value)}
          className={fieldClass}
        >
          <option value="" disabled>
            Bitte wählen…
          </option>
          {vertretungen.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.address})
            </option>
          ))}
          <option value="andere">Andere Praxis (manuell eingeben)</option>
        </select>
      </div>

      {isOther && (
        <div className="space-y-5 rounded-lg bg-surface-container/60 p-4">
          <div>
            <label htmlFor="replacement" className={labelClass}>
              Name der Vertretung
            </label>
            <input
              id="replacement"
              name="replacement"
              type="text"
              placeholder="z. B. Zahnarztpraxis Mustermann"
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="replacementPhone" className={labelClass}>
              Telefon der Vertretung{" "}
              <span className="text-on-surface-variant/60">(optional)</span>
            </label>
            <input
              id="replacementPhone"
              name="replacementPhone"
              type="tel"
              placeholder="z. B. 04171 2917"
              className={fieldClass}
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="note" className={labelClass}>
          Notiz <span className="text-on-surface-variant/60">(optional)</span>
        </label>
        <input
          id="note"
          name="note"
          type="text"
          placeholder="z. B. nur vormittags erreichbar"
          className={fieldClass}
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive font-medium">{state.error}</p>
      )}
      {state.success && (
        <p className="text-sm text-secondary font-medium">
          Urlaubszeit gespeichert.
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="bg-gradient-to-r from-primary to-primary-container text-white px-8 py-6 rounded-full"
      >
        {pending ? "Speichern…" : "Urlaubszeit hinzufügen"}
      </Button>
    </form>
  );
}
