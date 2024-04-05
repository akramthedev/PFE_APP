import { useEffect } from 'react';


function useOutsideAlerter(ref, setIsProfileClicked) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsProfileClicked(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, setIsProfileClicked]);
}

export default useOutsideAlerter;