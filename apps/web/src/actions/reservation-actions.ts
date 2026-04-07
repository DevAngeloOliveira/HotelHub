"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError, cancelReservation, createReservation } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";

export type ReservationActionState = { error?: string } | null;

export async function createReservationAction(
  _prev: ReservationActionState,
  formData: FormData,
): Promise<ReservationActionState> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const hotelId = formData.get("hotelId") as string;
  const roomId = formData.get("roomId") as string;
  const checkInDate = formData.get("checkInDate") as string;
  const checkOutDate = formData.get("checkOutDate") as string;
  const guestCount = Number(formData.get("guestCount"));

  try {
    await createReservation(token, { hotelId, roomId, checkInDate, checkOutDate, guestCount });
  } catch (e) {
    if (e instanceof ApiError && e.status === 409) {
      return { error: "Sem disponibilidade para o período selecionado." };
    }
    if (e instanceof ApiError && e.status === 400) {
      return { error: "Dados inválidos. Verifique as datas e a quantidade de hóspedes." };
    }
    return { error: "Erro ao criar reserva. Tente novamente." };
  }

  revalidatePath("/reservations");
  redirect("/reservations");
}

export async function createReservationCheckoutAction(formData: FormData): Promise<void> {
  await createReservationAction(null, formData);
}

export async function cancelReservationAction(
  reservationId: string,
): Promise<ReservationActionState> {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  try {
    await cancelReservation(token, reservationId);
  } catch (e) {
    if (e instanceof ApiError && e.status === 400) {
      return { error: "Esta reserva não pode ser cancelada." };
    }
    return { error: "Erro ao cancelar reserva. Tente novamente." };
  }

  revalidatePath("/reservations");
  return {};
}
