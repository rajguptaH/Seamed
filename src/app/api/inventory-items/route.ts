import { InventoryItem } from "@/models/InventoryItem";
import { createCollectionPost, createCollectionRoute } from "../[entity]/route";

export const GET = createCollectionRoute(InventoryItem);
export const POST = createCollectionPost(InventoryItem);
