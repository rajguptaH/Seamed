import { SupplyLog } from "@/models/SupplyLog";
import { createCollectionPost, createCollectionRoute } from "../[entity]/route";

export const GET = createCollectionRoute(SupplyLog);
export const POST = createCollectionPost(SupplyLog);
