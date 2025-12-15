import {useLayoutEffect, useState} from "react";

export default function useIsStandaloneApp(): boolean {
    const [isInstalledPwa, setIsInstalledPwa] = useState<boolean>(false);

    useLayoutEffect(() => {
        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        // @ts-ignore
        setIsInstalledPwa(mediaQuery.matches || navigator.standalone); // navigator.standalone is for iOS
        const handler = (ev: MediaQueryListEvent) => {
            setIsInstalledPwa(ev.matches);
        };
        mediaQuery.addEventListener('change', handler);
        return () => {
            mediaQuery.removeEventListener('change', handler);
        };
    })

    return isInstalledPwa;
}
