import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {


    const startTimeRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const [TimeToLogout, setTimeToLogout] = useState(null);
    const [timeToDisconnect, settimeToDisconnect] = useState(false);

    useEffect(() => {
        startTimeRef.current = performance.now();

        const interval = setInterval(() => {
        const endTime = performance.now();
        const newDuration = Math.floor((endTime - startTimeRef.current) / 1000); // Convert to seconds
        setDuration(newDuration);


                if (parseInt(newDuration) >= parseInt(TimeToLogout)) {
                    localStorage.removeItem('idUser');
                    localStorage.removeItem('token');
                    settimeToDisconnect(true);
                }
        
            
        }, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup interval
    }, [TimeToLogout]); // Added TimeToLogout as a dependency

  return (
    <TimerContext.Provider value={{ duration, TimeToLogout, setTimeToLogout, timeToDisconnect  }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
