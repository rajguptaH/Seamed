import { NonMedicalConsumptionLog } from "@/models/NonMedicineConsumptionLog";
import { createCollectionPost, createCollectionRoute } from "../[entity]/route";

export const GET = createCollectionRoute(NonMedicalConsumptionLog);
export const POST = createCollectionPost(NonMedicalConsumptionLog);
