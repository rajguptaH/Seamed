// seeds/seedObjectIds.ts
import { ObjectId } from "mongodb";

// Centralized ObjectId map for consistent relationships
export const objectIds = {
  companies: {
    globalMaritimeGroup: new ObjectId("6736e1a1f000000000000001"),
    oceanicShipping: new ObjectId("6736e1a1f000000000000002"),
  },
  users: {
    adminJohn: new ObjectId("6736e1a1f000000000000011"),
    doctorSmith: new ObjectId("6736e1a1f000000000000012"),
    operatorJane: new ObjectId("6736e1a1f000000000000013"),
    doctorJones: new ObjectId("6736e1a1f000000000000014"),
  },
  ships: {
    seaExplorer: new ObjectId("6736e1a1f000000000000021"),
    oceanVoyager: new ObjectId("6736e1a1f000000000000022"),
    pacificDrifter: new ObjectId("6736e1a1f000000000000023"),
  },
  other: {
    sampleMedicine: new ObjectId("6736e1a1f000000000000031"),
  },
};
