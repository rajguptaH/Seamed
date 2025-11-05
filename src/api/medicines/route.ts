import { Medicine } from "@/models/Medicine";
import { createCollectionPost, createCollectionRoute } from "../[entity]/route";

export const GET = createCollectionRoute(Medicine);
export const POST = createCollectionPost(Medicine);
