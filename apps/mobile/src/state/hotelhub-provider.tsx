import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { currentUserId, initialProfile, initialReservations, type Reservation, type UserProfile } from "../domain/hotelhub";
import {
  MobileApiError,
  cancelReservation as cancelReservationRequest,
  createReservation as createReservationRequest,
  getProfile,
  listMyReservations,
  updateProfile,
  type ReservationInput,
} from "../lib/api";
import { features } from "../lib/config";

type ToastTone = "info" | "success" | "warning" | "error";

type ToastState = {
  tone: ToastTone;
  title: string;
  message: string;
};

type HotelHubContextValue = {
  profile: UserProfile;
  reservations: Reservation[];
  allReservations: Reservation[];
  isBootstrapping: boolean;
  usesLiveProtectedApi: boolean;
  toast: ToastState | null;
  dismissToast: () => void;
  saveProfile: (name: string, phone: string) => Promise<void>;
  createReservation: (input: ReservationInput) => Promise<Reservation>;
  cancelReservation: (reservationId: string) => Promise<void>;
  refreshProtectedData: () => Promise<void>;
};

const HotelHubContext = createContext<HotelHubContextValue | undefined>(undefined);

export function HotelHubProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [allReservations, setAllReservations] = useState<Reservation[]>(initialReservations);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback((nextToast: ToastState) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast(nextToast);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3600);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const refreshProtectedData = useCallback(async () => {
    if (!features.protectedApiEnabled) {
      setIsBootstrapping(false);
      return;
    }

    try {
      const [nextProfile, nextReservations] = await Promise.all([
        getProfile(),
        listMyReservations(initialReservations),
      ]);
      setProfile(nextProfile);
      setAllReservations(nextReservations);
    } catch {
      setProfile(initialProfile);
      setAllReservations(initialReservations);
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  useEffect(() => {
    void refreshProtectedData();
  }, [refreshProtectedData]);

  const myReservations = useMemo(() => {
    const ownerId = profile.id || currentUserId;
    return allReservations
      .filter((reservation) => reservation.userId === ownerId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }, [allReservations, profile.id]);

  const saveProfile = useCallback(async (name: string, phone: string) => {
    const nextProfile = await updateProfile({ name, phone }, profile);
    setProfile(nextProfile);
    showToast({
      tone: "success",
      title: "Perfil atualizado",
      message: "Os dados do usuario foram salvos com sucesso.",
    });
  }, [profile, showToast]);

  const createReservation = useCallback(async (input: ReservationInput) => {
    const reservation = await createReservationRequest(input, allReservations, profile.id || currentUserId);

    if (features.protectedApiEnabled) {
      await refreshProtectedData();
    } else {
      setAllReservations((current) => [reservation, ...current]);
    }

    showToast({
      tone: "success",
      title: "Reserva confirmada",
      message: `Reserva ${reservation.id} criada com sucesso.`,
    });
    return reservation;
  }, [allReservations, profile.id, refreshProtectedData, showToast]);

  const cancelReservation = useCallback(async (reservationId: string) => {
    const updatedReservation = await cancelReservationRequest(reservationId, allReservations);

    if (features.protectedApiEnabled) {
      await refreshProtectedData();
    } else {
      setAllReservations((current) =>
        current.map((reservation) =>
          reservation.id === reservationId ? updatedReservation : reservation,
        ),
      );
    }

    showToast({
      tone: "warning",
      title: "Reserva cancelada",
      message: `Reserva ${reservationId} movida para o status CANCELLED.`,
    });
  }, [allReservations, refreshProtectedData, showToast]);

  const value = useMemo<HotelHubContextValue>(() => ({
    profile,
    reservations: myReservations,
    allReservations,
    isBootstrapping,
    usesLiveProtectedApi: features.protectedApiEnabled,
    toast,
    dismissToast,
    saveProfile,
    createReservation,
    cancelReservation,
    refreshProtectedData,
  }), [
    allReservations,
    createReservation,
    cancelReservation,
    dismissToast,
    isBootstrapping,
    myReservations,
    profile,
    refreshProtectedData,
    saveProfile,
    toast,
  ]);

  return <HotelHubContext.Provider value={value}>{children}</HotelHubContext.Provider>;
}

export function useHotelHub() {
  const context = useContext(HotelHubContext);
  if (!context) {
    throw new Error("useHotelHub must be used inside HotelHubProvider.");
  }
  return context;
}

export function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof MobileApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unexpected error.";
}
