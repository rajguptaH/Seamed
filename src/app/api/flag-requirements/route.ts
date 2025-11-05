import { FlagRequirement } from "@/models/FlagRequirement";
import { createCollectionPost, createCollectionRoute } from "../[entity]/route";

export const GET = createCollectionRoute(FlagRequirement);
export const POST = createCollectionPost(FlagRequirement);
