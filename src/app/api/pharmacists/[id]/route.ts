import { createEntityRoute } from "@/app/api/[entity]/[id]/route";
import { Pharmacist } from "@/models/Pharmacist";
const routes = createEntityRoute(Pharmacist);
export const GET = routes.GET;
export const PUT = routes.PUT;
export const DELETE = routes.DELETE;