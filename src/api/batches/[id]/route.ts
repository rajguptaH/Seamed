import { createEntityRoute } from "@/api/[entity]/[id]/route";
import { Batch } from "@/models/Batch";
const routes = createEntityRoute(Batch);
export const GET = routes.GET;
export const PUT = routes.PUT;
export const DELETE = routes.DELETE;