import { createEntityRoute } from "@/app/api/[entity]/[id]/route";
import { InventoryItem } from "@/models/InventoryItem";
const routes = createEntityRoute(InventoryItem);
export const GET = routes.GET;
export const PUT = routes.PUT;
export const DELETE = routes.DELETE;