// src/lib/dateFormat.ts
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/id"; // kalau mau locale Indonesia

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export type DateFormatType = 
  | "short"     // 20/08/25
  | "medium"    // 20 Agu 2025
  | "long"      // 20 Agustus 2025
  | "full"      // Rabu, 20 Agustus 2025
  | "time"      // 14:30
  | "datetime"  // 20/08/25 14:30
  | "relative"; // 2 hari lagi / 3 jam lalu

export function formatDate(
  date: string | Date | null | undefined,
  type: DateFormatType = "medium",
  locale: "id" | "en" = "id",
  tz: string = "Asia/Jakarta"
): string {
  if (!date) return "Not Set";

  const d = dayjs(date).locale(locale).tz(tz);

  switch (type) {
    case "short":
      return d.format("DD/MM/YY");
    case "medium":
      return d.format("DD MMM YYYY");
    case "long":
      return d.format("DD MMMM YYYY");
    case "full":
      return d.format("dddd, DD MMMM YYYY");
    case "time":
      return d.format("HH:mm");
    case "datetime":
      return d.format("DD/MM/YY HH:mm");
    case "relative":
      return d.fromNow();
    default:
      return d.format();
  }
}
