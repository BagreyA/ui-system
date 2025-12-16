import React, { createContext, useContext, useState } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [movementParams, setMovementParams] = useState({});
  const [trafficParams, setTrafficParams] = useState({});
  const [schedulerParams, setSchedulerParams] = useState({});
  const [userCount, setUserCount] = useState(0);

  const [selectedMovement, setSelectedMovement] = useState("");
  const [selectedTraffic, setSelectedTraffic] = useState("");
  const [selectedScheduler, setSelectedScheduler] = useState("");
  const [selectedConfig, setSelectedConfig] = useState("");
  const [userIds, setUserIds] = useState([]);

  return (
    <SettingsContext.Provider
      value={{
        movementParams,
        setMovementParams,
        trafficParams,
        setTrafficParams,
        schedulerParams,
        setSchedulerParams,
        userCount,
        setUserCount,
        userIds,
        setUserIds, 
        selectedMovement,
        setSelectedMovement,
        selectedTraffic,
        setSelectedTraffic,
        selectedScheduler,
        setSelectedScheduler,
        selectedConfig,
        setSelectedConfig,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Хук для удобного доступа к контексту
export const useSettings = () => useContext(SettingsContext);
