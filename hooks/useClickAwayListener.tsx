import { MutableRefObject, useEffect } from "react";

type Props = {
    backDropRef: MutableRefObject<HTMLElement | null>;
    action: () => void;
    selector: string;
};

export default function useClickAwayListener({
    action,
    backDropRef,
    selector,
}: Props) {
    useEffect(() => {
        const backDrop = backDropRef.current;
        if (!backDrop) return;

        const handleClick = (event: MouseEvent) => {
            const target = event.target;
            if (target instanceof Element && !target.closest(selector)) action();
        };

        backDrop.addEventListener("click", handleClick);
        return () => backDrop.removeEventListener("click", handleClick);
    }, [action, backDropRef, selector]);
}
