import { Pharmacist } from "@/models/Pharmacist";
import { createCollectionPost, createCollectionRoute } from "../[entity]/route";

export const GET = createCollectionRoute(Pharmacist);
export const POST = createCollectionPost(Pharmacist);
