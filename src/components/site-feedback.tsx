"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import "./site-feedback.css";
import { dictionaries, type Locale } from "@/lib/i18n";

type ToastKind = "success" | "error" | "info";
type ToastMessage = { id: number; message: string; kind: ToastKind };
type Confirmation = { title: string; description: string; confirmLabel: string; danger: boolean };
type FeedbackContextValue = {
  notify: (message: string, kind?: ToastKind) => void;
  askConfirmation: (options: Confirmation) => Promise<boolean>;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function useSiteFeedback() {
  const value = useContext(FeedbackContext);
  if (!value) throw new Error("useSiteFeedback harus digunakan di dalam SiteFeedbackProvider.");
  return value;
}

export function SiteFeedbackProvider({ children, locale = "id" }: { children: ReactNode; locale?: Locale }) {
  const copy = dictionaries[locale];
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const resolveConfirmationRef = useRef<((accepted: boolean) => void) | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const toastIdRef = useRef(0);

  const notify = useCallback((message: string, kind: ToastKind = "info") => {
    const id = ++toastIdRef.current;
    setToasts((current) => [...current, { id, message, kind }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4000);
  }, []);

  const closeConfirmation = useCallback((accepted: boolean) => {
    setConfirmation(null);
    resolveConfirmationRef.current?.(accepted);
    resolveConfirmationRef.current = null;
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const askConfirmation = useCallback((options: Confirmation) => {
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setConfirmation(options);
    return new Promise<boolean>((resolve) => { resolveConfirmationRef.current = resolve; });
  }, []);

  useEffect(() => {
    if (confirmation) cancelButtonRef.current?.focus();
  }, [confirmation]);

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeConfirmation(false);
      return;
    }
    if (event.key === "Tab" && dialogRef.current) {
      const controls = dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])");
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  };

  return (
    <FeedbackContext.Provider value={{ notify, askConfirmation }}>
      {children}
      <div className="site-toasts" aria-label={copy.toastRegion} aria-live="off">
        {toasts.map((toast) => {
          const Icon = toast.kind === "error" ? AlertCircle : toast.kind === "success" ? CheckCircle2 : Info;
          return (
            <div key={toast.id} className={`site-toast site-toast--${toast.kind}`} role={toast.kind === "error" ? "alert" : "status"}>
              <Icon size={20} aria-hidden="true" />
              <p>{toast.message}</p>
              <button type="button" aria-label={copy.closeToast} onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}><X size={18} aria-hidden="true" /></button>
            </div>
          );
        })}
      </div>
      {confirmation && (
        <div className="site-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeConfirmation(false); }}>
          <div ref={dialogRef} className="site-dialog" role="dialog" aria-modal="true" aria-labelledby="site-dialog-title" aria-describedby="site-dialog-description" onKeyDown={handleDialogKeyDown}>
            <h2 id="site-dialog-title">{confirmation.title}</h2>
            <p id="site-dialog-description">{confirmation.description}</p>
            <div className="site-dialog__actions">
              <button ref={cancelButtonRef} type="button" className="site-dialog__cancel" onClick={() => closeConfirmation(false)}>{copy.cancel}</button>
              <button type="button" className={`site-dialog__confirm${confirmation.danger ? " is-danger" : ""}`} onClick={() => closeConfirmation(true)}>{confirmation.confirmLabel}</button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}
