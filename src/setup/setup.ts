
import { connectDB, disconnectDB } from '@/config/db';
import { seedCompanies } from './seedCompanies';
import { seedFlagRequirements } from './seedFlagRequirements';
import { seedMedicalLogs } from './seedMedicalLogs';
import { seedMedicines } from './seedMedicines';
import { seedNonMedicalConsumptionLogs } from './seedNonMedicalConsumptionLogs';
import { seedShipInventory } from './seedShipInventory';
import { seedShips } from './seedShips';
import { seedSupplyLogs } from './seedSupplyLogs';

async function main() {
  try {
    await connectDB();

    // 1️⃣ Company and Ship Seeding
    const companyMap = await seedCompanies();
    const shipMap = await seedShips(companyMap);

    // 2️⃣ Medicines and Related Data
    const medicineMap = await seedMedicines();

    // 3️⃣ Logs and Inventories
    await seedMedicalLogs(shipMap);
    await seedNonMedicalConsumptionLogs(shipMap);
    await seedSupplyLogs(shipMap);
    await seedShipInventory(shipMap, medicineMap);

    // 4️⃣ Flag Requirements
    await seedFlagRequirements();

    console.log('🌱 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

main();
