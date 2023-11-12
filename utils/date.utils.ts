import { Timestamp } from "firebase-admin/firestore";
import dayjs from "dayjs";

export const dateFormat = "MMM DD, 'YY";
export const dateTimeFormat = "MMM DD, 'YY, hh:mm A";

export function fbTimestampToDateFormat(timestamp: Timestamp, format: string) {
  const date = timestamp.toDate();
  return dayjs(date).format(format);
}
