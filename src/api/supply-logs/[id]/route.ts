import { createEntityRoute } from "@/api/[entity]/[id]/route";
import { SupplyLog } from "@/models/SupplyLog";
const routes = createEntityRoute(SupplyLog);
export const GET = routes.GET;
export const PUT = routes.PUT;
export const DELETE = routes.DELETE;