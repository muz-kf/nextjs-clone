import { useEffect, useRef } from "react";

export default function useRunOnce(action: () => void) {
    const ran = useRef(false);

    useEffect(() => {
        if (!ran.current) {
            action();
        }

        return () => {
            ran.current = true;
        };
    }, [action]);
}
