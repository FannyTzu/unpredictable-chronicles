'use client';

import React from 'react';
import * as Dialog from "@radix-ui/react-dialog";
import {ReactNode} from "react";

import s from './style.module.css'

type ModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    children: ReactNode;
};

function Modal({open, onOpenChange, title, children,}: ModalProps) {

    return (
        <>
            <Dialog.Root open={open} onOpenChange={onOpenChange}>
                <Dialog.Portal>
                    <Dialog.Overlay className={s.overlay}/>
                    <Dialog.Content className={s.content}>
                        {title && <Dialog.Title className={s.title}>{title}</Dialog.Title>}

                        {children}

                        <Dialog.Close className={s.close}>✕</Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}

export default Modal;