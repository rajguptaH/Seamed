// utils/routes.ts

export const API_ROUTES = {
  // 🔹 Ship Endpoints
  ships: "/api/ships",
  shipById: (id: string) => `/api/ships/${id}`,
  shipInventory: (id: string) => `/api/ships/${id}/inventory`,
shipMedicalLogs: (id: string) => `/api/ships/${id}/medical-logs`,
shipNonMedicalLogs: (id: string) => `/api/ships/${id}/non-medical-consumption-logs`,
shipSupplyLogs : (id: string) => `/api/ships/${id}/supply-logs`,
  // 🔹 Company Endpoints
  companies: "/api/companies",
  companyById: (id: string) => `/api/companies/${id}`,

  // 🔹 Inventory Items
  inventoryItems: "/api/inventory-items",
  inventoryItemById: (id: string) => `/api/inventory-items/${id}`,

  // 🔹 Medical Logs
  medicalLogs: "/api/medical-logs",
  medicalLogById: (id: string) => `/api/medical-logs/${id}`,

  // 🔹 Non-Medical Consumption Logs
  nonMedicalConsumptionLogs: "/api/non-medical-consumption-logs",
  nonMedicalConsumptionLogById: (id: string) => `/api/non-medical-consumption-logs/${id}`,

  // 🔹 Supply Logs
  supplyLogs: "/api/supply-logs",
  supplyLogById: (id: string) => `/api/supply-logs/${id}`,

  // 🔹 Flag Requirements
  flagRequirements: "/api/flag-requirements",
  flagRequirementById: (id: string) => `/api/flag-requirements/${id}`,

  // 🔹 Medicines
  medicines: "/api/medicines",
  medicineById: (id: string) => `/api/medicines/${id}`,

  // 🔹 Authentication
  auth: {
    login: "/api/auth/login",
    me: "/api/auth/me",
  },
  // pharmacists
  pharmacists : "/api/pharmacists",
  pharmacistsById : "/api/pharmacists"
};
export const API_ENTITIES = {
  ships: "ships",
  companies: "companies",
  inventoryItems: "inventory-items",
  inventories: "inventories",
  medicalLogs: "medical-logs",
  nonMedicalConsumptionLogs: "non-medical-consumption-logs",
  supplyLogs: "supply-logs",
  medicines: "medicines",
  nonMedicalLogForShip : "non-medical-log-for-ship",
  flagRequirements: "flag-requirements",
  supplyLogForShip: "supply-log-for-ship",
  pharmacists: "pharmacists",


};
