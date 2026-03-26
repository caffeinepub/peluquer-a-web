import { useMutation } from "@tanstack/react-query";
import type { Reservation } from "../backend.d";
import { useActor } from "./useActor";

export function useSubmitReservation() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (reservation: Reservation) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitReservation(reservation);
    },
  });
}
