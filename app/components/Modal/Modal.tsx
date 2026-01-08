'use client';

import React, { ReactNode } from 'react';
import s from './style.module.css';

type ModalProps = {
  isOpen?: boolean;
  title?: string;
  message?: string;
  children?: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
};

function Modal({ isOpen, title, message, children, onClose, onConfirm }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        {title && <h2 className={s.title}>{title}</h2>}
        <div className={s.content}>
          {message && <p>{message}</p>}
          {children}
        </div>
        <div className={s.buttons}>
          {onConfirm && (
            <button className={s.confirmButton} onClick={onConfirm}>
              Confirmer
            </button>
          )}
          <button className={s.cancelButton} onClick={onClose}>
            {onConfirm ? 'Annuler' : 'Fermer'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
