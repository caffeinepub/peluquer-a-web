import List "mo:core/List";
import Order "mo:core/Order";
import Text "mo:core/Text";

actor {
  type Reservation = {
    customerName : Text;
    phoneNumber : Text;
    serviceName : Text;
    date : Text;
    time : Text;
  };

  module Reservation {
    public func compare(res1 : Reservation, res2 : Reservation) : Order.Order {
      switch (Text.compare(res1.date, res2.date)) {
        case (#equal) { Text.compare(res1.time, res2.time) };
        case (order) { order };
      };
    };
  };

  let reservations = List.empty<Reservation>();

  public shared ({ caller }) func submitReservation(reservation : Reservation) : async () {
    reservations.add(reservation);
  };

  public query ({ caller }) func getReservations() : async [Reservation] {
    reservations.toArray().sort();
  };
};
