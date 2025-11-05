import { Company } from "@/models/Company";
import { createCollectionPost, createCollectionRoute } from "../[entity]/route";

export const GET = createCollectionRoute(Company);
export const POST = createCollectionPost(Company);
