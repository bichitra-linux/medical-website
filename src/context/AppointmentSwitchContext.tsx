import React from "react";
import { createContext, useContext, ReactNode } from "react";
import useSWR, { KeyedMutator } from "swr";

interface AppointmentsSwitchContextType {
  appointmentsEnabled: boolean;
  toggleAppointments: () => Promise<void>;
  isLoading: boolean;
  error: any;
  mutate: KeyedMutator<{ enabled: boolean }>;
}

const AppointmentsSwitchContext = createContext<AppointmentsSwitchContextType | undefined>(
  undefined
);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function AppointmentsSwitchProvider({ children }: { children: ReactNode }) {
  const { data, error, isLoading, mutate } = useSWR<{ enabled: boolean }>(
    "/api/appointment",
    fetcher,
    {
      // start with false until we fetch the real value
      fallbackData: { enabled: false },
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );

  const appointmentsEnabled: boolean = data?.enabled ?? false;

  const toggleAppointments = async () => {
    try {
      const res = await fetch("/api/appointment", { method: "POST" });
      const updatedStatus = await res.json();
      // Update the local SWR cache with the new state from the server
      // and prevent revalidation to avoid race conditions if called rapidly.
      mutate(updatedStatus, false);
    } catch (e) {
      console.error("Failed to toggle appointment status:", e);
      // Optionally re-throw or handle error (e.g., show a toast)
    }
  };

  return (
    <AppointmentsSwitchContext.Provider
      value={{
        appointmentsEnabled, // Default to true if data is not yet loaded
        toggleAppointments,
        isLoading,
        error,
        mutate,
      }}
    >
      {children}
    </AppointmentsSwitchContext.Provider>
  );
}

export function useAppointmentsSwitch() {
  const context = useContext(AppointmentsSwitchContext);
  if (context === undefined) {
    throw new Error("useAppointmentsSwitch must be used within an AppointmentsSwitchProvider");
  }
  return context;
}
