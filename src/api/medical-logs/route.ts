import { MedicalLog } from "@/models/MedicalLog";
import { createCollectionPost, createCollectionRoute } from "../[entity]/route";

export const GET = createCollectionRoute(MedicalLog);
export const POST = createCollectionPost(MedicalLog);
