"use client";
import { useData } from "@/context/DataProvider";
import { API_ENTITIES, API_ROUTES } from "@/utils/routes";

export async function fetchMedicalLogsForShip(shipId: string) {
    const { fetchEntity } = useData();
    const medicalLogs = await fetchEntity(API_ENTITIES.medicalLogs, API_ROUTES.shipMedicalLogs(shipId));
    return medicalLogs;
}

export async function fetchNonMedicalLogsForShip(shipId: string) {
    const { fetchEntity } = useData();
    const nonMedicalLogs = await fetchEntity(API_ENTITIES.nonMedicalLogForShip, API_ROUTES.shipNonMedicalLogs(shipId));
    return nonMedicalLogs;
}
export async function fetchCompanyById(companyId: string) {
    const { fetchEntity } = useData();
    const company = await fetchEntity(API_ENTITIES.companies, API_ROUTES.companyById(companyId));
    return company;
}
export async function fetchSupplyLogsForShip(shipId: string) {
    const { fetchEntity } = useData();
    const supplyLogs = await fetchEntity(API_ENTITIES.supplyLogForShip, API_ROUTES.shipSupplyLogs(shipId));
    return supplyLogs;
}
export async function getMedicines() {
    const { fetchEntity } = useData();
    const medicines = await fetchEntity(API_ENTITIES.medicines, API_ROUTES.medicines);
    return medicines;
}
export async function getInventoryForShip(shipId: string) {
    const { fetchEntity } = useData();
    const inventory = await fetchEntity(API_ENTITIES.inventories, API_ROUTES.shipInventory(shipId));
    return inventory;
}
export async function getShipById(shipId: string) {
    const { fetchEntity } = useData();
    const ship = await fetchEntity(API_ENTITIES.ships, API_ROUTES.shipById(shipId));
    return ship;
}
export async function getAllShips() {
    const { fetchEntity } = useData();
    const ships = await fetchEntity(API_ENTITIES.ships, API_ROUTES.ships);
    return ships;
}