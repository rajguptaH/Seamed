import { createEntityRoute } from "@/app/api/[entity]/[id]/route";
import { Medicine } from "@/models/Medicine";
const routes = createEntityRoute(Medicine);
export const GET = routes.GET;
export const PUT = routes.PUT;
export const DELETE = routes.DELETE;