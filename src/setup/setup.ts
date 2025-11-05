
import { exec } from 'child_process';
import * as path from 'path';
import { connectDB, disconnectDB } from '../config/db';
async function runScript(scriptPath: string) {
  return new Promise<void>((resolve, reject) => {
  
    console.log(`🚀 Running ${path.basename(scriptPath)}...`);
    exec(`npx tsx ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error in ${scriptPath}:`, stderr || error.message);
        reject(error);
        return;
      }
      console.log(stdout);
      resolve();
    });
  });
}


async function main() {
  try {
    await connectDB();

    await runScript("src/setup/seedCompanies.ts");
    await runScript("src/setup/seedShips.ts");
    await runScript("src/setup/seedMedicines.ts");
    await runScript("src/setup/seedMedicalLogs.ts");
    await runScript("src/setup/seedSupplyLogs.ts");
    await runScript("src/setup/seedNonMedicalConsumptionLogs.ts");
    await runScript("src/setup/seedShipInventory.ts");
    await runScript("src/setup/seedFlagRequirements.ts");


    console.log('🌱 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

main();
