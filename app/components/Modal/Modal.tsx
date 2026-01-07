'use client';

import React, { ReactNode } from 'react';
import s from './style.module.css';

type ModalProps = {
    isOpen: boolean;
    title?: string;
    children: ReactNode;
};

function Modal({ isOpen, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className={s.overlay}>
            <div className={s.modal}>
                {title && <h2 className={s.title}>{title}</h2>}
                <div className={s.content}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
