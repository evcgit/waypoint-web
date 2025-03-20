import React, { createContext, useState, useContext, useEffect } from 'react';

const TripContext = createContext();

export const TripProvider = ({ children }) => {
	const [selectedTrip, setSelectedTrip] = useState(() => {
    const savedTrip = localStorage.getItem('selectedTrip');
    return savedTrip ? JSON.parse(savedTrip) : null;
  });

  useEffect(() => {
    if (selectedTrip) {
      localStorage.setItem('selectedTrip', JSON.stringify(selectedTrip));
    } else {
      localStorage.removeItem('selectedTrip');
    }
  }, [selectedTrip]);

  return (
    <TripContext.Provider value={{ selectedTrip, setSelectedTrip }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);