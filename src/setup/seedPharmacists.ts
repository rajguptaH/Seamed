import * as dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config({ path: ".env" });

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/seamed";
if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env");
}

const client = new MongoClient(uri);

const objectIds = {
  pharmacists: {
    lijuanQiu: new ObjectId("650000000000000000000001"),
  },
};

const pharmacists = [
  {
    _id: objectIds.pharmacists.lijuanQiu,
    name: "LIJUANQIU",
    licenseNumber: "Zy00487661",
    signature: "Lijuan Qiu", // can be a string or URL to an image
    supplier: {
      name: "Qingdao Wanvutung Dispensary Co., Ltd",
      address: "No. 364 Jiangshan North Road, Qingdao Free Trade Zone, Shandong, China",
      stateLicense: "***",
      tel: "+86(0532)86892367A",
    },
  },
];

async function seedPharmacists() {
  try {
    await client.connect();
    const db = client.db();

    // Optional: Remove existing data to avoid duplicates
    await db.collection("pharmacists").deleteMany({});

    const result = await db.collection("pharmacists").insertMany(pharmacists);
    console.log(`✅ Inserted ${result.insertedCount} pharmacist(s)`);
  } catch (err) {
    console.error("❌ Seeding pharmacists failed:", err);
  } finally {
    await client.close();
    process.exit(0);
  }
}

seedPharmacists();
