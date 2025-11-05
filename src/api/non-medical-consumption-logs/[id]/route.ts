import { createEntityRoute } from "@/api/[entity]/[id]/route";
import { NonMedicalConsumptionLog } from "@/models/NonMedicineConsumptionLog";
const routes = createEntityRoute(NonMedicalConsumptionLog);
export const GET = routes.GET;
export const PUT = routes.PUT;
export const DELETE = routes.DELETE;