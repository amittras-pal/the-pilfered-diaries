import { Timestamp } from "firebase-admin/firestore";

export const dateFormat = "MMM DD, 'YY";
export const dateTimeFormat = "MMM DD, 'YY, hh:mm A";

export function isoDateOfTimestamp(timestamp: Timestamp) {
  return timestamp.toDate().toISOString();
}
