import * as dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config({ path: ".env" });

const uri = "mongodb://localhost:27017/seamed";
if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env");
}

const client = new MongoClient(uri);

const companies = [
  {
    name: 'Global Maritime Group',
    address: '123 Ocean Ave, Maritime City, 12345',
    phone: '+1-234-567-8901',
    pic: {
      _id: new ObjectId(),
      name: 'John Admin',
      email: '[admin@globalmaritime.com](mailto:admin@globalmaritime.com)',
      phone: '+1-234-567-8902',
      phone2: '+1-234-567-8904',
    },
    doctor: {
      _id: new ObjectId(),
      name: 'Dr. Smith',
      email: '[doctor@globalmaritime.com](mailto:doctor@globalmaritime.com)',
      phone: '+1-234-567-8903',
      phone2: '+1-234-567-8905',
    },
    medicalLogFormNumber: 'GMG-ML-001',
  },
  {
    name: 'Oceanic Shipping Co.',
    address: '456 Sea Lane, Port Town, 67890',
    phone: '+1-987-654-3210',
    pic: {
      _id: new ObjectId(),
      name: 'Jane Operator',
      email: '[ops@oceanicshipping.com](mailto:ops@oceanicshipping.com)',
      phone: '+1-987-654-3211',
    },
    doctor: {
      _id: new ObjectId(),
      name: 'Dr. Jones',
      email: '[medic@oceanicshipping.com](mailto:medic@oceanicshipping.com)',
      phone: '+1-987-654-3212',
    },
    medicalLogFormNumber: 'OSC-FORM-MED-A',
  },
];

async function seedCompanies() {
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection("companies").insertMany(companies);
    console.log(`✅ Inserted ${result.insertedCount} companies`);
  } catch (err) {
    console.error("❌ Seeding companies failed:", err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seedCompanies();
