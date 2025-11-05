import { createEntityRoute } from "@/app/api/[entity]/[id]/route";
import { FlagRequirement } from "@/models/FlagRequirement";
const routes = createEntityRoute(FlagRequirement);
export const GET = routes.GET;
export const PUT = routes.PUT;
export const DELETE = routes.DELETE;