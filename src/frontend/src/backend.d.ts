import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Reservation {
    customerName: string;
    serviceName: string;
    date: string;
    time: string;
    phoneNumber: string;
}
export interface backendInterface {
    getReservations(): Promise<Array<Reservation>>;
    submitReservation(reservation: Reservation): Promise<void>;
}
