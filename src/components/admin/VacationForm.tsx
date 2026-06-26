"use client";

import { useActionState, useRef, useState } from "react";
import {
  createVacationAction,
  type VacationFormState,
} from "@/app/admin/actions";
import type { Vertretung } from "@content/vertretungen";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

const initialState: VacationFormState = {};

const fieldClass =
  "w-full rounded-lg bg-surface-container px-4 py-3 text-base text-foreground outline-none ring-1 ring-outline-variant/40 focus:ring-2 focus:ring-primary transition";
const labelClass = "block text-sm font-medium text-on-surface-variant mb-1.5";

interface Row {
  key: number;
  vertretungId: string;
  name: string;
  phone: string;
  address: string;
  from: string;
  to: string;
}

function newRow(key: number, from = "", to = ""): Row {
  return { key, vertretungId: "", name: "", phone: "", address: "", from, to };
}

export function VacationForm({ vertretungen }: { vertretungen: Vertretung[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const keyCounter = useRef(1);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [rows, setRows] = useState<Row[]>([newRow(0)]);

  const [state, action, pending] = useActionState(
    async (prev: VacationFormState, formData: FormData) => {
      const result = await createVacationAction(prev, formData);
      if (result.success) {
        formRef.current?.reset();
        setStart("");
        setEnd("");
        keyCounter.current = 1;
        setRows([newRow(0)]);
      }
      return result;
    },
    initialState,
  );

  function updateRow(key: number, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((rs) => [...rs, newRow(keyCounter.current++, start, end)]);
  }

  function removeRow(key: number) {
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.key !== key) : rs));
  }

  // Serialized payload sent to the server action.
  const rowsPayload = JSON.stringify(
    rows.map(({ vertretungId, name, phone, address, from, to }) => ({
      vertretungId,
      name,
      phone,
      address,
      from,
      to,
    })),
  );

  return (
    <form ref={formRef} action={action} className="space-y-6">
      <input type="hidden" name="rows" value={rowsPayload} />

      {/* Closure period */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="start" className={labelClass}>
            Praxis geschlossen — Von
          </label>
          <input
            id="start"
            name="start"
            type="date"
            required
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="end" className={labelClass}>
            Bis
          </label>
          <input
            id="end"
            name="end"
            type="date"
            required
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      {/* Replacement rows */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-primary">
          Vertretungen während der Schließzeit
        </p>

        {rows.map((row, i) => {
          const isOther = row.vertretungId === "andere";
          return (
            <div
              key={row.key}
              className="rounded-xl bg-surface-container/50 p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-secondary uppercase tracking-[0.15em]">
                  Vertretung {i + 1}
                </span>
                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(row.key)}
                    aria-label="Vertretung entfernen"
                    className="inline-flex items-center justify-center w-7 h-7 rounded-md text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div>
                <label className={labelClass}>Praxis / Zahnarzt</label>
                <select
                  required
                  value={row.vertretungId}
                  onChange={(e) =>
                    updateRow(row.key, { vertretungId: e.target.value })
                  }
                  className={fieldClass}
                >
                  <option value="" disabled>
                    Bitte wählen…
                  </option>
                  {vertretungen.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                      {v.address ? ` (${v.address})` : ""}
                    </option>
                  ))}
                  <option value="andere">Andere Praxis (manuell eingeben)</option>
                </select>
              </div>

              {isOther && (
                <div className="space-y-4 rounded-lg bg-surface p-4">
                  <div>
                    <label className={labelClass}>Name der Vertretung</label>
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) =>
                        updateRow(row.key, { name: e.target.value })
                      }
                      placeholder="z. B. Zahnarztpraxis Mustermann"
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Adresse</label>
                    <input
                      type="text"
                      value={row.address}
                      onChange={(e) =>
                        updateRow(row.key, { address: e.target.value })
                      }
                      placeholder="z. B. Musterstraße 1, 21423 Winsen"
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      Telefon{" "}
                      <span className="text-on-surface-variant/60">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="tel"
                      value={row.phone}
                      onChange={(e) =>
                        updateRow(row.key, { phone: e.target.value })
                      }
                      placeholder="z. B. 04171 12345"
                      className={fieldClass}
                    />
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Zuständig von</label>
                  <input
                    type="date"
                    required
                    min={start || undefined}
                    max={end || undefined}
                    value={row.from}
                    onChange={(e) =>
                      updateRow(row.key, { from: e.target.value })
                    }
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>bis</label>
                  <input
                    type="date"
                    required
                    min={start || undefined}
                    max={end || undefined}
                    value={row.to}
                    onChange={(e) => updateRow(row.key, { to: e.target.value })}
                    className={fieldClass}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-colors"
        >
          <Plus className="w-4 h-4" />
          Weitere Vertretung hinzufügen
        </button>
      </div>

      {/* Note */}
      <div>
        <label htmlFor="note" className={labelClass}>
          Notiz <span className="text-on-surface-variant/60">(optional)</span>
        </label>
        <input
          id="note"
          name="note"
          type="text"
          placeholder="z. B. Wiedereröffnung um 8:00 Uhr"
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
