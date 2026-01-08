'use client';

import React, { ReactNode } from 'react';
import s from './style.module.css';

type ModalProps = {
    isOpen?: boolean;
    title?: string;
    message?: string;
    children?: ReactNode;
    onClose?: () => void;
};

function Modal({ isOpen, title, message, children, onClose }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className={s.overlay}>
            <div className={s.modal}>
                {title && <h2 className={s.title}>{title}</h2>}
                <div className={s.content}>
                    {children}
                </div>
                <div>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    );
}

export default Modal;
