"use client";
import { ModalProps } from "./Modal.types";
import { modalStyles } from "./Modal.styles";

export function Modal({open,onClose,children,}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className={modalStyles.overlay}
      onClick={onClose}
    >
    <div
      className={modalStyles.container}
      onClick={(e) => e.stopPropagation()}
    >      
        {children}
      </div>
    </div>
  );
}