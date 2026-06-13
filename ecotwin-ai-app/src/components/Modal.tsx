/**
 * Modal.tsx
 * ─────────
 * Fully accessible modal dialog component.
 *
 * Accessibility features:
 *  - role="dialog" + aria-modal="true"
 *  - aria-labelledby pointing to the modal title
 *  - Focus trap: Tab / Shift+Tab cycle only within focusable children
 *  - Escape key closes the modal
 *  - Focus moves to the first focusable element on open
 *  - Backdrop click closes the modal
 *  - Body scroll is locked while the modal is open
 */
import React, { useEffect, useRef, useCallback } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Visible title rendered in the modal header */
  title: string;
  children: React.ReactNode;
  /** Optional id prefix — used to build aria-labelledby. Defaults to 'modal' */
  id?: string;
  /** Optional CSS max-width class override. Defaults to 'max-w-md' */
  maxWidth?: string;
}

const FOCUSABLE_SELECTORS =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  id = 'modal',
  maxWidth = 'max-w-md',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = `${id}-title`;

  /** Trap focus inside the dialog and handle Escape */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
      ).filter((el) => el.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;

    // Move focus to dialog on open
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
    firstFocusable?.focus();

    // Lock body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    // Backdrop — aria-hidden so screen readers only interact with the dialog
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-hidden={undefined}  // override the parent's aria-hidden
        className={`bg-surface-container-low border border-white/15 rounded-2xl p-8 w-full ${maxWidth} mx-4 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            id={titleId}
            className="font-headline-md text-headline-md text-on-surface"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-on-surface-variant hover:text-on-surface transition-colors rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          >
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};
