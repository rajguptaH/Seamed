import { Types } from 'mongoose';
import { Company } from '../models/Company';

export async function seedCompanies() {
  const companies = [
    {
      name: 'Global Maritime Group',
      address: '123 Ocean Ave, Maritime City, 12345',
      phone: '+1-234-567-8901',
      pic: {
        _id: new Types.ObjectId(), // nested object _id
        name: 'John Admin',
        email: 'admin@globalmaritime.com',
        phone: '+1-234-567-8902',
        phone2: '+1-234-567-8904',
      },
      doctor: {
        _id: new Types.ObjectId(),
        name: 'Dr. Smith',
        email: 'doctor@globalmaritime.com',
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
        _id: new Types.ObjectId(),
        name: 'Jane Operator',
        email: 'ops@oceanicshipping.com',
        phone: '+1-987-654-3211',
      },
      doctor: {
        _id: new Types.ObjectId(),
        name: 'Dr. Jones',
        email: 'medic@oceanicshipping.com',
        phone: '+1-987-654-3212',
      },
      medicalLogFormNumber: 'OSC-FORM-MED-A',
    },
  ];

  const docs = await Company.insertMany(companies);
  console.log(`✅ Inserted ${docs.length} companies`);

  const companyMap: Record<string, string> = {};
  docs.forEach(doc => (companyMap[doc.name] = doc._id.toString()));

  return companyMap;
}
