import { atom, useAtom } from "jotai";
import { ReactNode, useCallback, useEffect } from "react";

const dialogAtom = atom(false);

const dialogContent = atom<DialogProps>({
    message: "Are you Sure ?",
    action: () => {
        console.log("default func ran!!");
    },
});

type DialogProps = {
    message: ReactNode;
    action: () => void;
};

export default function useConfirmDialog() {
    const [isOpen, setIsOpen] = useAtom(dialogAtom);
    const [dialogProps, setDialogProps] = useAtom(dialogContent);
    const { action } = dialogProps;

    const handleClose = useCallback((ev: KeyboardEvent) => {
        console.log("event listener call handleClose => ", ev);
        if (ev.key === "Escape") setIsOpen(false);
        if (ev.key === "Enter") {
            action();
            setIsOpen(false);
        }
    }, [action, setIsOpen]);

    useEffect(() => {
        if (isOpen) document.body.addEventListener("keydown", handleClose);
        else document.body.removeEventListener("keydown", handleClose);
        return () => document.body.removeEventListener("keydown", handleClose);
    }, [handleClose, isOpen]);

    return {
        isOpen,
        setIsOpen,
        onOpen: () => setIsOpen(true),
        onClose: () => setIsOpen(false),
        content: dialogProps,
        setDialogProps,
        openWithContent: (message: ReactNode, action: () => void) => {
            setDialogProps({
                action,
                message,
            });
            setIsOpen(true);
        },
    };
}
