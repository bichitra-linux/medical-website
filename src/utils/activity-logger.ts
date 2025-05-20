import { adminDb } from "@/pages/api/firebase/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

type ActivityType = "appointment" | "service" | "gallery" | "settings";
type ActivityStatus = "success" | "warning" | "error";

export async function logActivity(
  message: string, 
  type: ActivityType = "appointment", 
  status: ActivityStatus = "success",
  userId?: string
) {
  try {
    await adminDb.collection("activities").add({
      message,
      type,
      status,
      timestamp: FieldValue.serverTimestamp(),
      userId: userId || null
    });
    return true;
  } catch (error) {
    console.error("Error logging activity:", error);
    return false;
  }
}