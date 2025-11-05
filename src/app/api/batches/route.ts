import { Batch } from "@/models/Batch";
import { createCollectionPost, createCollectionRoute } from "../[entity]/route";

export const GET = createCollectionRoute(Batch);
export const POST = createCollectionPost(Batch);
