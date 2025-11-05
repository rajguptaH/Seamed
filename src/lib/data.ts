

'use server';
import { promises as fs } from 'fs';
import path from 'path';
import type { PharmacistDetails } from './certificate-data';

// --- MOCKED DATA ---

let companies: Company[] = [
    { 
        id: '1', 
        name: 'Global Maritime Group', 
        address: '123 Ocean Ave, Maritime City, 12345',
        phone: '+1-234-567-8901',
        pic: { name: 'John Admin', email: 'admin@globalmaritime.com', phone: '+1-234-567-8902', phone2: '+1-234-567-8904' },
        doctor: { name: 'Dr. Smith', email: 'doctor@globalmaritime.com', phone: '+1-234-567-8903', phone2: '+1-234-567-8905' },
        medicalLogFormNumber: 'GMG-ML-001'
    },
    { 
        id: '2', 
        name: 'Oceanic Shipping Co.',
        address: '456 Sea Lane, Port Town, 67890',
        phone: '+1-987-654-3210',
        pic: { name: 'Jane Operator', email: 'ops@oceanicshipping.com', phone: '+1-987-654-3211' },
        doctor: { name: 'Dr. Jones', email: 'medic@oceanicshipping.com', phone: '+1-987-654-3212' },
        medicalLogFormNumber: 'OSC-FORM-MED-A'
    },
];

let ships: Ship[] = [
  { id: '1', name: 'The Sea Explorer', imo: '9876543', flag: 'Panama', crewCount: 25, companyId: '1', category: 'A' },
  { id: '2', name: 'The Ocean Voyager', imo: '1234567', flag: 'Liberia', crewCount: 35, companyId: '1', category: 'B' },
  { id: '3', name: 'The Pacific Drifter', imo: '7654321', flag: 'Marshall Islands', crewCount: 18, companyId: '2', category: 'C' },
];

const staticDate = new Date('2024-06-20T10:00:00Z');

let medicalLogs: MedicalLog[] = [
    { id: 'log1', shipId: '1', date: new Date('2024-06-05T10:00:00Z'), crewMemberName: 'John Doe', rank: 'Deck Cadet', caseDescription: 'Cut on hand', notes: 'Minor injury during routine maintenance.', medicineUsedId: 'inv1', batchUsedId: 'batch2', quantityUsed: 1, photoUrl: 'https://picsum.photos/seed/medlog1/600/400' },
    { id: 'log2', shipId: '1', date: new Date('2024-05-20T10:00:00Z'), crewMemberName: 'Jane Smith', rank: 'Chief Mate', caseDescription: 'Seasickness', notes: 'Resolved within 24 hours.', medicineUsedId: 'med39', quantityUsed: 2, batchUsedId: 'batch_placeholder', photoUrl: null },
];

let nonMedicalConsumptionLogs: NonMedicalConsumptionLog[] = [
    { id: 'nmc1', shipId: '1', date: new Date('2024-06-15T10:00:00Z'), medicineId: 'med2', batchId: 'batch3', quantity: 10, reason: 'Damaged', notes: 'Water damage in storage.'}
];

let supplyLogs: SupplyLog[] = [
    { id: 'sup1', shipId: '1', date: new Date('2024-06-18T14:00:00Z'), portOfSupply: 'Singapore', supplierName: 'MediSupplies Inc.', trackingNumber: 'MS123456789SG', status: 'Delivered', notes: 'Full order received.', items: [] },
    { id: 'sup2', shipId: '1', date: new Date('2024-07-10T09:00:00Z'), portOfSupply: 'Rotterdam', supplierName: 'Euro Pharma', trackingNumber: 'EP987654321NL', status: 'Shipped', notes: 'Partial shipment. Remainder to follow.', items: [] },
];

let medicines: Medicine[] = [
    // Medicines
    { id: 'med1', name: 'Acetylsalicylic acid', type: 'Medicine', form: 'tab', strength: '300mg', indication: 'pain, fever, blood clots', notes: null, category: null },
    { id: 'med2', name: 'Aciclovir', type: 'Medicine', form: 'tab', strength: '400mg', indication: 'herpes simples/zoster', notes: null, category: null },
    { id: 'med3', name: 'Adrenaline', type: 'Medicine', form: 'amp', strength: '1 mg/ml', indication: 'anaphylaxis', notes: null, category: null },
    { id: 'med4', name: 'Amoxicillin + clavulanic acid', type: 'Medicine', form: 'tab', strength: '875mg/125mg', indication: 'infections', notes: null, category: null },
    { id: 'med5', name: 'Artemether', type: 'Medicine', form: 'amp', strength: '80mg/ml', indication: 'malaria treatment', notes: null, category: null },
    { id: 'med6', name: 'Artemether + Lumefantrine', type: 'Medicine', form: 'tab', strength: '20mg/120mg', indication: 'malaria treatment', notes: 'double if crew size > 30', category: null },
    { id: 'med7', name: 'Atropine', type: 'Medicine', form: 'amp', strength: '1.2mg/ml', indication: 'MI/organophosphate poisoning', notes: 'double quantity if carrying organophosphates', category: null },
    { id: 'med8', name: 'Azithromycin', type: 'Medicine', form: 'tab', strength: '500mg', indication: 'infections', notes: null, category: null },
    { id: 'med9', name: 'Ceftriaxone', type: 'Medicine', form: 'amp', strength: '1g', indication: 'infections', notes: null, category: null },
    { id: 'med10', name: 'Cetirizine', type: 'Medicine', form: 'tab', strength: '10 mg', indication: 'hay fever/hives/dermatitis', notes: null, category: null },
    { id: 'med11', name: 'Charcoal, activated', type: 'Medicine', form: 'powder', strength: null, indication: 'poisoning', notes: null, category: null },
    { id: 'med12', name: 'Ciprofloxacin', type: 'Medicine', form: 'tab', strength: '250mg', indication: 'infections', notes: 'double if crew size >30', category: null },
    { id: 'med13', name: 'Cloves, oil of', type: 'Medicine', form: 'liq', strength: null, indication: 'toothache', notes: null, category: null },
    { id: 'med14', name: 'Dexamethasone', type: 'Medicine', form: 'amp', strength: '4mg/ml', indication: 'severe asthma/anaphylaxis', notes: null, category: null },
    { id: 'med15', name: 'Diazepam', type: 'Medicine', form: 'tab', strength: '5mg', indication: 'alcohol withdrawal', notes: null, category: null },
    { id: 'med16', name: 'Docusate with senna', type: 'Medicine', form: 'tab', strength: '50mg/8mg', indication: 'constipation', notes: null, category: null },
    { id: 'med17', name: 'Doxycycline', type: 'Medicine', form: 'tab', strength: '100mg', indication: 'infections', notes: null, category: null },
    { id: 'med18', name: 'Ethanol, hand cleanser', type: 'Medicine', form: 'gel', strength: '70%', indication: 'hand cleaning', notes: null, category: null },
    { id: 'med19', name: 'Ethanol', type: 'Medicine', form: 'liq', strength: '70%', indication: 'disinfect instruments', notes: null, category: null },
    { id: 'med20', name: 'Fluorescein', type: 'Medicine', form: 'eye strips', strength: '1%', indication: 'detect corneal damage', notes: null, category: null },
    { id: 'med21', name: 'Frusemide', type: 'Medicine', form: 'amp', strength: '40mg/4ml', indication: 'pulmonary oedema', notes: null, category: null },
    { id: 'med22', name: 'Glucagon', type: 'Medicine', form: 'amp', strength: '1mg', indication: 'hypoglycaemia', notes: null, category: null },
    { id: 'med23', name: 'Haloperidol', type: 'Medicine', form: 'amp', strength: '5mg/ml', indication: 'psychosis/severe agitation', notes: null, category: null },
    { id: 'med24', name: 'Hydrocortisone', type: 'Medicine', form: 'crm', strength: '1%', indication: 'allergy/inflammatory skin', notes: 'one (1) tube per patient', category: null },
    { id: 'med25', name: 'Ibuprofen', type: 'Medicine', form: 'tab', strength: '400 mg', indication: 'inflammation/pain', notes: null, category: null },
    { id: 'med26', name: 'Isosorbide dinitrate', type: 'Medicine', form: 'tab', strength: '5 mg', indication: 'angina/MI', notes: null, category: null },
    { id: 'med27', name: 'Lignocaine', type: 'Medicine', form: 'amp', strength: '1%, 5ml', indication: 'suturing/minor surgery', notes: null, category: null },
    { id: 'med28', name: 'Loperamide', type: 'Medicine', form: 'tab', strength: '2mg', indication: 'diarrhea', notes: null, category: null },
    { id: 'med29', name: 'Mebendazole', type: 'Medicine', form: 'tab', strength: '100mg', indication: 'intestinal worms', notes: null, category: null },
    { id: 'med30', name: 'Metroprolol', type: 'Medicine', form: 'tab', strength: '100mg', indication: 'HTN/AF/angina/migraine', notes: null, category: null },
    { id: 'med31', name: 'Metronidazole', type: 'Medicine', form: 'tab', strength: '500 mg', indication: 'infections', notes: null, category: null },
    { id: 'med32', name: 'Miconazole', type: 'Medicine', form: 'crm', strength: '2%', indication: 'fungal skin infections', notes: 'double quantities if females on board', category: null },
    { id: 'med33', name: 'Midazolam', type: 'Medicine', form: 'amp', strength: '5mg/ml', indication: 'epileptic fits', notes: null, category: null },
    { id: 'med34', name: 'Misoprostol', type: 'Medicine', form: 'tab', strength: '200ug', indication: 'post-partum hemorrhage', notes: 'only if females on board', category: null },
    { id: 'med35', name: 'Morphine (Controlled Substance)', type: 'Medicine', form: 'amp', strength: '10mg/ml', indication: 'severe pain', notes: null, category: null },
    { id: 'med36', name: 'Morphine (Controlled Substance)', type: 'Medicine', form: 'liq', strength: '1mg/ml', indication: 'severe pain in patients able to eat and drink', notes: 'double if crew size > 30', category: null },
    { id: 'med37', name: 'Naloxone', type: 'Medicine', form: 'amp', strength: '0.4mg/ml', indication: 'opiate overdose', notes: null, category: null },
    { id: 'med38', name: 'Omeprazole', type: 'Medicine', form: 'tab', strength: '20mg', indication: 'reflux, peptic ulcers', notes: 'double if crew size > 30', category: null },
    { id: 'med39', name: 'Ondanestron', type: 'Medicine', form: 'tab', strength: '4mg', indication: 'vomiting, sea-sickness', notes: null, category: null },
    { id: 'med40', name: 'Oral rehydration solution', type: 'Medicine', form: 'powder', strength: 'sachet', indication: 'dehydration due to diarrhea', notes: 'quantities in brackets are number of sachets based on sachets made up to 200ml', category: null },
    { id: 'med41', name: 'Oxymetazoline', type: 'Medicine', form: 'nasal drop', strength: '0.50%', indication: 'nasal obstruction/drain sinuses', notes: 'one (1) bottle per patient', category: null },
    { id: 'med42', name: 'Paracetamol', type: 'Medicine', form: 'tab', strength: '500mg', indication: 'pain and fever', notes: null, category: null },
    { id: 'med43', name: 'Permethrin', type: 'Medicine', form: 'lot', strength: '1%', indication: 'lice', notes: 'double if crew size > 30', category: null },
    { id: 'med44', name: 'Permethrin', type: 'Medicine', form: 'lot', strength: '5%', indication: 'scabies', notes: '100ml per patient', category: null },
    { id: 'med45', name: 'Povidone iodine', type: 'Medicine', form: 'liq', strength: '10%', indication: 'disinfect skin/wounds', notes: null, category: null },
    { id: 'med46', name: 'Povidone iodine', type: 'Medicine', form: 'oint', strength: '10%', indication: 'disinfect skin/wounds', notes: null, category: null },
    { id: 'med47', name: 'Prednisone', type: 'Medicine', form: 'tab', strength: '25mg', indication: 'asthma/inflammatory conditions', notes: null, category: null },
    { id: 'med48', name: 'Salbutamol', type: 'Medicine', form: 'inh', strength: '100ug/dose', indication: 'asthma/bronchitis/emphysema', notes: 'one (1) inhaler per patient', category: null },
    { id: 'med49', name: 'Sodium chloride', type: 'Medicine', form: 'liq', strength: '0.9%, 1 litre', indication: 'fluid replacement', notes: null, category: null },
    { id: 'med50', name: 'Tetracaine (amethocaine)', type: 'Medicine', form: 'eye drop', strength: '0.50%, 1ml', indication: 'eye examination', notes: null, category: null },
    { id: 'med51', name: 'Tetracycline', type: 'Medicine', form: 'eye ointment', strength: '1%', indication: 'minor eye infections', notes: 'one (1) tube per patient', category: null },
    { id: 'med52', name: 'Vitamin K', type: 'Medicine', form: 'amp', strength: '10mg/ml', indication: 'reverse warfarin or similar', notes: null, category: null },
    { id: 'med53', name: 'Water for injection', type: 'Medicine', form: 'amp', strength: '5ml', indication: 'reconstitute injection', notes: 'only used to reconstitute ceftriaxone', category: null },
    { id: 'med54', name: 'Zidovudine + lamivudine', type: 'Medicine', form: 'tab', strength: '300mg/150mg', indication: 'needle-stick injury prophylaxis', notes: null, category: null },
    { id: 'med55', name: 'Zinc Oxide', type: 'Medicine', form: 'Paste/ointment', strength: '20%', indication: 'irritated skin', notes: '4 x 25g or 3 x 30g tubes per 100g', category: null },
    // Equipment
    { id: 'eq1', name: 'Portable oxygen set, complete', type: 'Equipment', form: 'set', strength: null, indication: 'Appliance for the administration of oxygen', notes: 'containing: 1 oxygen cylinder, 1 spare, pressure regulator, and 3 face masks', category: 'Resuscitation' },
    { id: 'eq2', name: 'Oropharyngeal airway (Guedel)', type: 'Equipment', form: 'airway', strength: 'medium and large', indication: 'Oropharyngeal airway', notes: 'Mayo-tube', category: 'Resuscitation' },
    { id: 'eq3', name: 'Mechanical aspirator', type: 'Equipment', form: 'aspirator', strength: null, indication: 'Manual aspirator to clear upper airways', notes: 'including 2 catheters', category: 'Resuscitation' },
    { id: 'eq4', name: 'Bag and mask resuscitator', type: 'Equipment', form: 'resuscitator', strength: null, indication: 'Ambubag (or equivalent)', notes: 'supplied with large, medium and small masks', category: 'Resuscitation' },
    { id: 'eq5', name: 'Cannula for mouth-to-mouth resuscitation', type: 'Equipment', form: 'cannula', strength: null, indication: 'Brook Airway, Lifeway, pocket face mask or equivalent', notes: null, category: 'Resuscitation' },
    { id: 'eq6', name: 'Adhesive dressings', type: 'Equipment', form: 'strips', strength: null, indication: 'Assorted wound-plaster or plaster strips', notes: 'water-resistant', category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq7', name: 'Eye pads', type: 'Equipment', form: 'pads', strength: null, indication: 'Eye pads', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq8', name: 'Sterile gauze compresses, 5x5 cm', type: 'Equipment', form: 'compresses', strength: '5x5 cm', indication: 'Sterile gauze compresses, sterile', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq9', name: 'Sterile gauze compresses, 10x10 cm', type: 'Equipment', form: 'compresses', strength: '10x10 cm', indication: 'Sterile gauze compresses, sterile', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq10', name: 'Gauze roll', type: 'Equipment', form: 'roll', strength: '5cm and 90cm or 60cm x 100 m', indication: 'Gauze roll, non-sterile', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq11', name: 'Gauze dressing with non-adherent surface', type: 'Equipment', form: 'dressing', strength: '10 cm square', indication: 'Non-adherent gauze dressing', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq12', name: 'Vaseline gauze', type: 'Equipment', form: 'dressing', strength: '10 x 10 cm', indication: 'Paraffin gauze dressing, sterile', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq13', name: 'Bandage', type: 'Equipment', form: 'bandage', strength: '4 m x 6 cm', indication: 'Elastic fixation bandage', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq14', name: 'Sterile compression bandages', type: 'Equipment', form: 'bandage', strength: 'small/medium/large', indication: 'first-aid absorbent gauze-covered cotton pad sewn into a cotton bandage', notes: 'ambulance dressing', category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq15', name: 'Tubular gauze for finger bandage', type: 'Equipment', form: 'bandage', strength: '5 m', indication: 'tubular gauze for finger bandage with applicator', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq16', name: 'Adhesive elastic bandage', type: 'Equipment', form: 'bandage', strength: '4 m x 6 cm', indication: 'adhesive elastic bandage', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq17', name: 'Triangular sling', type: 'Equipment', form: 'sling', strength: null, indication: 'triangular sling', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq18', name: 'Sterile sheet for burn victims', type: 'Equipment', form: 'sheet', strength: null, indication: 'sterile sheet for burn patients', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq19', name: 'Honey or burn kit for dressing burns', type: 'Equipment', form: 'kit', strength: '1 kg', indication: 'Honey or burn kit for dressing burns', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq20', name: 'Adhesive sutures or zinc oxide bandages', type: 'Equipment', form: 'tape', strength: '5 x 1.25 cm', indication: 'adhesive tape, waterproof, skin-friendly', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq21', name: 'Q-tips', type: 'Equipment', form: 'tips', strength: null, indication: 'Q-tips (wooden)', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq22', name: 'Safety pins', type: 'Equipment', form: 'pins', strength: '12 pcs', indication: 'safety pins (stainless steel)', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq23', name: 'Butterfly sutures', type: 'Equipment', form: 'sutures', strength: null, indication: 'butterfly sutures, Steristrips® or Leukostrip®, sterile', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq24', name: 'Skin adhesive', type: 'Equipment', form: 'liquid', strength: '0.5 ml', indication: '2-octyl cyanoacrylate liquid', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq25', name: 'Suturing equipment', type: 'Equipment', form: 'sutures', strength: '1-0, 3-0, 4-0 or 5-0', indication: 'sutures, absorbable with curved non-traumatic needs', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq26', name: 'Gloves (examination)', type: 'Equipment', form: 'gloves', strength: null, indication: 'disposable examination gloves', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq27', name: 'Gloves (surgical)', type: 'Equipment', form: 'gloves', strength: '6.5, 7.5, 8.5', indication: 'surgical gloves, sterile, in pairs', notes: null, category: 'Dressing Material and Suturing Equipment' },
    { id: 'eq28', name: 'Disposable scalpels', type: 'Equipment', form: 'scalpel', strength: null, indication: 'scalpel, sterile, disposable', notes: null, category: 'Instruments' },
    { id: 'eq29', name: 'Stainless-steel instrument box', type: 'Equipment', form: 'box', strength: null, indication: 'instrument box (stainless steel)', notes: null, category: 'Instruments' },
    { id: 'eq30', name: 'Scissors (operating)', type: 'Equipment', form: 'scissors', strength: null, indication: 'operating scissors, straight (stainless steel)', notes: null, category: 'Instruments' },
    { id: 'eq31', name: 'Scissors (bandage)', type: 'Equipment', form: 'scissors', strength: null, indication: 'bandage scissors (stainless steel)', notes: null, category: 'Instruments' },
    { id: 'eq32', name: 'Forceps (splinter)', type: 'Equipment', form: 'forceps', strength: null, indication: 'splinter forceps, pointed (stainless steel)', notes: null, category: 'Instruments' },
    { id: 'eq33', name: 'Forceps (teeth tissue)', type: 'Equipment', form: 'forceps', strength: null, indication: 'teeth tissue forceps (stainless steel)', notes: null, category: 'Instruments' },
    { id: 'eq34', name: 'Needle holder', type: 'Equipment', form: 'holder', strength: '1800 mm, straight', indication: 'needle holder, Mayo-Hegar', notes: null, category: 'Instruments' },
    { id: 'eq35', name: 'Haemostatic clamps', type: 'Equipment', form: 'clamp', strength: '125 mm, stainless steel', indication: 'haemostatic clamp, Lahlstead mosquito', notes: null, category: 'Instruments' },
    { id: 'eq36', name: 'Disposable razors', type: 'Equipment', form: 'razor', strength: null, indication: 'razor, disposable', notes: null, category: 'Instruments' },
    { id: 'eq37', name: 'Disposable tongue depressors', type: 'Equipment', form: 'depressors', strength: null, indication: 'tongue depressors, disposable', notes: null, category: 'Examination and monitoring equipment' },
    { id: 'eq38', name: 'Reactive strips for urine analysis', type: 'Equipment', form: 'strips', strength: '50 paper strips', indication: 'reactive strips for urine analysis: blood/glucose/protein/nitrite/leukocytes', notes: null, category: 'Examination and monitoring equipment' },
    { id: 'eq39', name: 'Microscope slides', type: 'Equipment', form: 'slides', strength: null, indication: 'microscope slides', notes: null, category: 'Examination and monitoring equipment' },
    { id: 'eq40', name: 'Stethoscope', type: 'Equipment', form: 'stethoscope', strength: null, indication: 'stethoscope', notes: null, category: 'Examination and monitoring equipment' },
    { id: 'eq41', name: 'Aneriod sphygmomanometer', type: 'Equipment', form: 'sphygmomanometer', strength: null, indication: 'sphygomamanometer (blood pressure set), preferably automatic', notes: null, category: 'Examination and monitoring equipment' },
    { id: 'eq42', name: 'Standard thermometer', type: 'Equipment', form: 'thermometer', strength: null, indication: 'thermometer, digital if possible', notes: null, category: 'Examination and monitoring equipment' },
    { id: 'eq43', name: 'Rectal thermometer', type: 'Equipment', form: 'thermometer', strength: null, indication: 'thermometer, digital if possible', notes: null, category: 'Examination and monitoring equipment' },
    { id: 'eq44', name: 'Hypothermic thermometer', type: 'Equipment', form: 'thermometer', strength: '32°-34°', indication: 'thermometer, digital if possible', notes: null, category: 'Examination and monitoring equipment' },
    { id: 'eq45', name: 'Penlight', type: 'Equipment', form: 'penlight', strength: null, indication: 'penlight + blue cover', notes: null, category: 'Examination and monitoring equipment' },
    { id: 'eq46', name: 'Magnifying glass', type: 'Equipment', form: 'loupe', strength: 'a x 8', indication: 'loupe', notes: null, category: 'Examination and monitoring equipment' },
    { id: 'eq47', name: 'Marker', type: 'Equipment', form: 'marker', strength: null, indication: 'waterproof indelible marker', notes: null, category: 'Examination and monitoring equipment' },
    { id: 'eq48', name: 'Syringes, 2ml', type: 'Equipment', form: 'disposable', strength: 'Luer connection, sterile', indication: 'Equipment for injection', notes: null, category: 'Equipment for injection, infusion, and catheterization' },
    { id: 'eq49', name: 'Syringes, 5ml', type: 'Equipment', form: 'disposable', strength: 'Luer connection, sterile', indication: 'Equipment for injection', notes: null, category: 'Equipment for injection, infusion, and catheterization' },
    { id: 'eq50', name: 'Hypodermic subcutaneous needle', type: 'Equipment', form: 'disposable', strength: '16 x 0.5 mm, sterile', indication: 'Equipment for injection', notes: null, category: 'Equipment for injection, infusion, and catheterization' },
    { id: 'eq51', name: 'Hypodermic intramuscular needle', type: 'Equipment', form: 'disposable', strength: '40 x 0.8 mm, sterile', indication: 'Equipment for injection', notes: null, category: 'Equipment for injection, infusion, and catheterization' },
    { id: 'eq52', name: 'Needles, 19G, blunt, "drawing up" type', type: 'Equipment', form: 'disposable', strength: null, indication: 'Equipment for injection', notes: null, category: 'Equipment for injection, infusion, and catheterization' },
    { id: 'eq53', name: 'Intravenous infusion cannula', type: 'Equipment', form: '16G (1.2 mm) and 22G (0.8 mm)', strength: 'Luer-lock connection, sterile non-recap type', indication: 'Equipment for infusion', notes: null, category: 'Equipment for injection, infusion, and catheterization' },
    { id: 'eq54', name: 'Intravenous giving set', type: 'Equipment', form: 'sterile', strength: 'Luer-lock connection', indication: 'Equipment for infusion', notes: null, category: 'Equipment for injection, infusion, and catheterization' },
    { id: 'eq55', name: 'Tourniquet, blood-taking type', type: 'Equipment', form: 'tourniquet', strength: 'to be used with intravenous infusion cannula', indication: 'Equipment for infusion', notes: null, category: 'Equipment for injection, infusion, and catheterization' },
    { id: 'eq56', name: 'Penile sheath set', type: 'Equipment', form: 'set', strength: 'with condom catheter, tube, and bag', indication: 'Bladder drainage equipment', notes: null, category: 'Equipment for injection, infusion, and catheterization' },
    { id: 'eq57', name: 'Short-term urine catheter', type: 'Equipment', form: 'soft-eye straight tip Thieman No. 12 and No. 16 or equivalent', strength: 'sterile, individually packed, prelubricated or with additional lignocaine/chlorhexidine lubricant', indication: 'Bladder drainage equipment', notes: null, category: 'Equipment for injection, infusion, and catheterization' },
    { id: 'eq58', name: 'Urine collecting bag and tube', type: 'Equipment', form: 'bag and tube', strength: null, indication: 'Bladder drainage equipment', notes: null, category: 'Equipment for injection, infusion, and catheterization' },
    { id: 'eq59', name: 'Eye protection', type: 'Equipment', form: 'goggles or full-face masks', strength: null, indication: 'Eye protection', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq60', name: 'Plastic apron', type: 'Equipment', form: 'disposable', strength: null, indication: 'Plastic apron', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq61', name: 'Kidney dish', type: 'Equipment', form: 'stainless steel, 825 ml', strength: null, indication: 'Kidney dish', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq62', name: 'Plastic backed towels', type: 'Equipment', form: 'absorbent 600 x 500 mm', strength: null, indication: 'Plastic backed towels', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq63', name: 'Safety box', type: 'Equipment', form: 'for sharps disposal, 5 l', strength: null, indication: 'Safety box', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq64', name: 'Mask, duckbill type', type: 'Equipment', form: 'disposable', strength: null, indication: 'Mask', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq65', name: 'Tape measure', type: 'Equipment', form: 'vinyl coated, 1.5 m', strength: null, indication: 'Tape measure', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq66', name: 'Draw sheets', type: 'Equipment', form: 'plastic 90 x 180 cm', strength: null, indication: 'Draw sheets', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq67', name: 'Bedpan, stainless steel', type: 'Equipment', form: 'stainless steel', strength: null, indication: 'Bedpan', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq68', name: 'Hot-water bag', type: 'Equipment', form: 'hot-water bag', strength: null, indication: 'Hot-water bottle', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq69', name: 'Urine bottle', type: 'Equipment', form: 'urinal, male (plastic)', strength: null, indication: 'Urine bottle', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq70', name: 'Ice bag', type: 'Equipment', form: 'cold/hot pack maxi', strength: null, indication: 'Ice bag', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq71', name: 'Aluminum foil blanket', type: 'Equipment', form: 'aluminum foil blanket', strength: null, indication: 'Aluminum foil blanker', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq72', name: 'Condoms', type: 'Equipment', form: 'male condoms', strength: null, indication: 'Condoms', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq73', name: 'Wash bottle', type: 'Equipment', form: 'plastic wash bottles, 250 ml', strength: null, indication: 'Wash bottle', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq74', name: 'Plastic bottle', type: 'Equipment', form: '1 litre, plastic with screw top', strength: null, indication: 'Plastic bottle', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq75', name: 'Dressing tray', type: 'Equipment', form: 'stainless steel dressing tray, 300 x 200 x 30 mm', strength: null, indication: 'Dressing tray', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq76', name: 'Plastic apron', type: 'Equipment', form: 'apron, protection, plastic, disposable', strength: null, indication: 'Plastic apron', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq77', name: 'Bowl, stainless steel', type: 'Equipment', form: '180 ml', strength: null, indication: 'Bowl', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq78', name: 'Specimen jars', type: 'Equipment', form: 'plastic, with lids and labels, 100 ml', strength: null, indication: 'Specimen jars', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq79', name: 'Plaster-of Paris bandage', type: 'Equipment', form: 'bandages, POP, 5 cm and 10 cm x 2.7m', strength: null, indication: 'Plaster-of Paris bandage', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq80', name: 'Stockinet', type: 'Equipment', form: 'sizes for arm and leg splints, 10 m roll', strength: null, indication: 'Stockinet', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq81', name: 'Cotton wool', type: 'Equipment', form: 'cotton wool roll, 500 g', strength: null, indication: 'Cotton wool', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq82', name: 'Alcohol swabs', type: 'Equipment', form: '70% alcohol swabs for skin cleansing prior to injection', strength: null, indication: 'Alcohol swabs', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq83', name: 'Nail brush', type: 'Equipment', form: 'nail brush', strength: null, indication: 'Nail brush', notes: null, category: 'General medical and nursing equipment' },
    { id: 'eq84', name: 'Thermometer for refrigerator', type: 'Equipment', form: 'thermometer for refrigerator', strength: null, indication: 'Thermometer for refrigerator', notes: null, category: 'General medical and nursing equipment' },
];

let shipInventory: { [key: string]: InventoryItem[] } = {
  '1': [
    { id: 'inv1', shipId: '1', medicineId: 'med1', medicineName: "Acetylsalicylic acid", medicineCategory: 'Uncategorized', type: 'Medicine', totalQuantity: 45, requiredQuantity: 50, batches: [
      { id: 'batch1', inventoryItemId: 'inv1', quantity: 20, batchNumber: 'A123', expiryDate: new Date('2025-02-20T10:00:00Z'), manufacturerName: 'Aspirin' },
      { id: 'batch2', inventoryItemId: 'inv1', quantity: 25, batchNumber: 'B456', expiryDate: new Date('2024-08-20T10:00:00Z'), manufacturerName: 'Disprin' },
    ] },
    { id: 'inv2', shipId: '1', medicineId: 'med2', medicineName: "Aciclovir", medicineCategory: 'Uncategorized', type: 'Medicine', totalQuantity: 60, requiredQuantity: 70, batches: [
      { id: 'batch3', inventoryItemId: 'inv2', quantity: 60, batchNumber: 'C789', expiryDate: new Date('2024-06-10T10:00:00Z') },
    ] },
     { id: 'inv4', shipId: '1', medicineId: 'eq1', medicineName: "Portable oxygen set, complete", medicineCategory: 'Resuscitation', type: 'Equipment', totalQuantity: 1, requiredQuantity: 1, batches: [
      { id: 'batch5', inventoryItemId: 'inv4', quantity: 1, batchNumber: null, expiryDate: null },
    ] },
  ],
  '2': [
    { id: 'inv3', shipId: '2', medicineId: 'med1', medicineName: "Acetylsalicylic acid", medicineCategory: 'Uncategorized', type: 'Medicine', totalQuantity: 40, requiredQuantity: 50, batches: [
      { id: 'batch4', inventoryItemId: 'inv3', quantity: 40, batchNumber: 'D111', expiryDate: new Date('2025-06-20T10:00:00Z'), manufacturerName: 'Aspirin' },
    ] },
  ],
};

const defaultRequirements: (Omit<FlagRequirement, "medicineId">)[] = [
    // Medicines
    { categoryA: '50', categoryB: '50', categoryC: '-' },
    { categoryA: '70+', categoryB: '35+', categoryC: '-' },
    { categoryA: '10+', categoryB: '5+', categoryC: '5+' },
    { categoryA: '20', categoryB: '10', categoryC: '-' },
    { categoryA: '12+', categoryB: '12+', categoryC: '-' },
    { categoryA: '24+', categoryB: '24+', categoryC: '-' },
    { categoryA: '10+', categoryB: '5+', categoryC: '-' },
    { categoryA: '10+', categoryB: '5+', categoryC: '-' },
    { categoryA: '15', categoryB: '5+', categoryC: '-' },
    { categoryA: '30+', categoryB: '30+', categoryC: '-' },
    { categoryA: '120g+', categoryB: '120g+', categoryC: '-' },
    { categoryA: '20+', categoryB: '10+', categoryC: '-' },
    { categoryA: '10ml', categoryB: '10ml+', categoryC: '-' },
    { categoryA: '3', categoryB: '1', categoryC: '-' },
    { categoryA: '50+', categoryB: '20+', categoryC: '-' },
    { categoryA: '30+', categoryB: '-', categoryC: '-' },
    { categoryA: '10', categoryB: '-', categoryC: '-' },
    { categoryA: '500ml', categoryB: '500ml+', categoryC: '100ml+' },
    { categoryA: '500ml', categoryB: '100ml', categoryC: '-' },
    { categoryA: '20+', categoryB: '20+', categoryC: '-' },
    { categoryA: '5+', categoryB: '5+', categoryC: '-' },
    { categoryA: '1+', categoryB: '1+', categoryC: '-' },
    { categoryA: '5', categoryB: '5+', categoryC: '-' },
    { categoryA: '2x30g', categoryB: '1x30g', categoryC: '-' },
    { categoryA: '100', categoryB: '50', categoryC: '50+' },
    { categoryA: '10', categoryB: '10', categoryC: '5+' },
    { categoryA: '5', categoryB: '5', categoryC: '-' },
    { categoryA: '30', categoryB: '30', categoryC: '10+' },
    { categoryA: '6+', categoryB: '6+', categoryC: '-' },
    { categoryA: '60+', categoryB: '-', categoryC: '-' },
    { categoryA: '30+', categoryB: '20+', categoryC: '-' },
    { categoryA: '2x30g', categoryB: '1x30g', categoryC: '-' },
    { categoryA: '10+', categoryB: '5+', categoryC: '-' },
    { categoryA: '3+', categoryB: '3+', categoryC: '-' },
    { categoryA: '10', categoryB: '10', categoryC: '-' },
    { categoryA: '100ml+', categoryB: '100ml+', categoryC: '-' },
    { categoryA: '10+', categoryB: '5+', categoryC: '-' },
    { categoryA: '30+', categoryB: '30+', categoryC: '-' },
    { categoryA: '10', categoryB: '10', categoryC: '10+' },
    { categoryA: '15l(75)', categoryB: '10l(50)', categoryC: '2l(10)+' },
    { categoryA: '2', categoryB: '1', categoryC: '-' },
    { categoryA: '100', categoryB: '50', categoryC: '25' },
    { categoryA: '200ml+', categoryB: '100ml+', categoryC: '-' },
    { categoryA: '300ml+', categoryB: '100ml+', categoryC: '-' },
    { categoryA: '100ml', categoryB: '100ml', categoryC: '100ml+' },
    { categoryA: '1x25g', categoryB: '1x25g', categoryC: '-' },
    { categoryA: '30+', categoryB: '30+', categoryC: '-' },
    { categoryA: '1', categoryB: '1', categoryC: '-' },
    { categoryA: '5+', categoryB: '1', categoryC: '-' },
    { categoryA: '20+', categoryB: '20+', categoryC: '-' },
    { categoryA: '2', categoryB: '1', categoryC: '1+' },
    { categoryA: '2+', categoryB: '2+', categoryC: '-' },
    { categoryA: '15', categoryB: '5+', categoryC: '-' },
    { categoryA: '56+', categoryB: '56+', categoryC: '-' },
    { categoryA: '200g+', categoryB: '100g+', categoryC: '100g+' },
    // Equipment
    { quantity: '1' }, // eq1
    { quantity: '2' }, // eq2
    { quantity: '1' }, // eq3
    { quantity: '1' }, // eq4
    { quantity: '1' }, // eq5
    { quantity: '200' }, // eq6
    { quantity: '3' }, // eq7
    { quantity: '100' }, // eq8
    { quantity: '100' }, // eq9
    { quantity: '1' }, // eq10
    { quantity: '100' }, // eq11
    { quantity: '50' }, // eq12
    { quantity: '3' }, // eq13
    { quantity: '5' }, // eq14
    { quantity: '1' }, // eq15
    { quantity: '10' }, // eq16
    { quantity: '5' }, // eq17
    { quantity: '1' }, // eq18
    { quantity: '1' }, // eq19
    { quantity: '10' }, // eq20
    { quantity: '100' }, // eq21
    { quantity: '50' }, // eq22
    { quantity: '20' }, // eq23
    { quantity: '2' }, // eq24
    { quantity: '10' }, // eq25 - 10 each
    { quantity: '50' }, // eq26
    { quantity: '9' },  // eq27 - 3 of each size (3x3)
    { quantity: '20' }, // eq28
    { quantity: '1' },  // eq29
    { quantity: '1' },  // eq30
    { quantity: '1' },  // eq31
    { quantity: '3' },  // eq32
    { quantity: '1' },  // eq33
    { quantity: '1' },  // eq34
    { quantity: '3' },  // eq35
    { quantity: '50' }, // eq36
    { quantity: '100' },// eq37
    { quantity: '100' },// eq38
    { quantity: '100' },// eq39
    { quantity: '1' },  // eq40
    { quantity: '1' },  // eq41
    { quantity: '1' },  // eq42
    { quantity: '1' },  // eq43
    { quantity: '1' },  // eq44
    { quantity: '1' },  // eq45
    { quantity: '1' },  // eq46
    { quantity: '1' },  // eq47
    { quantity: '50' }, // eq48
    { quantity: '50' }, // eq49
    { quantity: '20' }, // eq50
    { quantity: '20' }, // eq51
    { quantity: '20' }, // eq52
    { quantity: '10' }, // eq53 - 10 each
    { quantity: '3' }, // eq54
    { quantity: '1' }, // eq55
    { quantity: '2' }, // eq56
    { quantity: '2' }, // eq57
    { quantity: '2' }, // eq58
    { quantity: '2' }, // eq59
    { quantity: '20' }, // eq60
    { quantity: '2' }, // eq61
    { quantity: '10' }, // eq62
    { quantity: '1' }, // eq63
    { quantity: '50' }, // eq64
    { quantity: '1' }, // eq65
    { quantity: '2' }, // eq66
    { quantity: '1' }, // eq67
    { quantity: '1' }, // eq68
    { quantity: '1' }, // eq69
    { quantity: '1' }, // eq70
    { quantity: '1' }, // eq71
    { quantity: '100' }, // eq72
    { quantity: '1' }, // eq73
    { quantity: '3' }, // eq74
    { quantity: '1' }, // eq75
    { quantity: '20' }, // eq76
    { quantity: '3' }, // eq77
    { quantity: '10' }, // eq78
    { quantity: '12' }, // eq79 - 12 each
    { quantity: '1' }, // eq80 - 1 each
    { quantity: '10' }, // eq81
    { quantity: '200' }, // eq82
    { quantity: '1' }, // eq83
    { quantity: '1' }, // eq84
];

const fullDefaultRequirements = medicines.map((med, index) => ({
    medicineId: med.id,
    ...defaultRequirements[index]
}));


let flagRequirements: Record<Flag, FlagRequirement[]> = {
    "Panama": JSON.parse(JSON.stringify(fullDefaultRequirements)),
    "Liberia": JSON.parse(JSON.stringify(fullDefaultRequirements)),
    "Marshall Islands": JSON.parse(JSON.stringify(fullDefaultRequirements)),
    "Hong Kong": JSON.parse(JSON.stringify(fullDefaultRequirements)),
    "Singapore": JSON.parse(JSON.stringify(fullDefaultRequirements)),
    "India": JSON.parse(JSON.stringify(fullDefaultRequirements)),
    "Cayman Islands": JSON.parse(JSON.stringify(fullDefaultRequirements)),
};


// --- API Functions ---
export async function getCompanies(): Promise<Company[]> {
    return companies;
}

export async function getCompanyById(id: string): Promise<Company | undefined> {
    return companies.find(c => c.id === id);
}

export async function getShips(): Promise<Ship[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return ships;
}

export async function getMedicalLogsForShip(shipId: string): Promise<MedicalLog[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const logs = medicalLogs.filter(log => log.shipId === shipId);

    const detailedLogs = await Promise.all(logs.map(async log => {
        const batch = await getBatchById(log.batchUsedId);
        return {
            ...log,
            batchNumber: batch?.batchNumber,
            expiryDate: batch?.expiryDate
        };
    }));
    
    return detailedLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getNonMedicalConsumptionLogsForShip(shipId: string): Promise<NonMedicalConsumptionLog[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const logs = nonMedicalConsumptionLogs.filter(log => log.shipId === shipId);
    
    const detailedLogs = await Promise.all(logs.map(async log => {
        const medicine = await getMedicines().then(meds => meds.find(m => m.id === log.medicineId));
        const batch = await getBatchById(log.batchId);
        return {
            ...log,
            medicineName: medicine?.name || 'Unknown',
            batchNumber: batch?.batchNumber || 'N/A'
        };
    }));

    return detailedLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getSupplyLogsForShip(shipId: string): Promise<SupplyLog[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return supplyLogs.filter(log => log.shipId === shipId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}


export async function getInventoryForShip(shipId: string): Promise<InventoryItem[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const currentShip = await getShipById(shipId);
    if (!currentShip) {
        throw new Error('Ship not found');
    }

    const flagReqs = flagRequirements[currentShip.flag] || [];
    const masterMedicineList = await getMedicines();

    // Ensure every item in master list is in inventory, even if empty
    const shipInv = shipInventory[shipId] || [];
    
    const detailedInventory: InventoryItem[] = masterMedicineList.map(med => {
        const existingItem = shipInv.find(i => i.medicineId === med.id);
        const requirement = flagReqs.find(req => req.medicineId === med.id);

        let requiredQuantity = 0;
        if (requirement) {
            let baseQtyStr: string | undefined;
            if (med.type === 'Medicine') {
                const catKey = `category${currentShip.category}` as keyof Omit<FlagRequirement, 'medicineId'>;
                baseQtyStr = requirement[catKey];
            } else { // Equipment
                baseQtyStr = requirement.quantity;
            }

            if (baseQtyStr && baseQtyStr !== '-') {
                const baseQty = parseInt(baseQtyStr.replace(/[^0-9]/g, ''), 10) || 0;
                
                if (med.type === 'Medicine') {
                    // Rule: quantity is per 10 crew, rounded up.
                    const crewMultiplier = Math.ceil(currentShip.crewCount / 10);
                    requiredQuantity = baseQty * crewMultiplier;
                } else {
                    requiredQuantity = baseQty;
                }
                
                if (med.notes?.includes('double if crew size > 30') && currentShip.crewCount > 30) {
                    requiredQuantity *= 2;
                }
                 if (med.notes?.includes('per patient')) {
                    requiredQuantity *= currentShip.crewCount;
                }
            }
        }

        if (existingItem) {
            return {
                ...existingItem,
                medicineName: med.name,
                medicineCategory: med.category || 'Uncategorized',
                type: med.type,
                requiredQuantity: requiredQuantity,
                totalQuantity: existingItem.batches.reduce((sum, b) => sum + b.quantity, 0),
            };
        } else {
            const newInvItem: InventoryItem = {
                id: `inv${Math.random()}`,
                shipId,
                medicineId: med.id,
                medicineName: med.name,
                medicineCategory: med.category || 'Uncategorized',
                type: med.type,
                requiredQuantity: requiredQuantity,
                totalQuantity: 0,
                batches: [],
            };
            if (!shipInventory[shipId]) {
              shipInventory[shipId] = [];
            }
            shipInventory[shipId].push(newInvItem);
            return newInvItem;
        }
    });

    return detailedInventory;
}


export async function getMedicines(): Promise<Medicine[]> {
    return medicines;
}

export async function getFlagRequirements(): Promise<Record<Flag, FlagRequirement[]>> {
    return flagRequirements;
}

export async function createCompany(newCompanyData: Omit<Company, 'id'>): Promise<Company> {
    if (companies.some(c => c.name.toLowerCase() === newCompanyData.name.toLowerCase())) {
        throw new Error(`A company with the name "${newCompanyData.name}" already exists.`);
    }
    const newCompany: Company = { ...newCompanyData, id: String(companies.length + 1) };
    companies.push(newCompany);
    return newCompany;
}

export async function updateCompany(companyId: string, updates: Partial<Omit<Company, 'id'>>): Promise<Company> {
    const company = companies.find(c => c.id === companyId);
    if (company) {
        Object.assign(company, updates);
        return company;
    }
    throw new Error("Company not found");
}

export async function createMedicalLog(newLogData: Omit<MedicalLog, 'id' | 'batchNumber' | 'expiryDate'>): Promise<MedicalLog> {
    const newLog: MedicalLog = { ...newLogData, id: `log${Math.random()}` };
    medicalLogs.push(newLog);
    return newLog;
}

export async function createNonMedicalConsumptionLog(newLogData: Omit<NonMedicalConsumptionLog, 'id'>): Promise<NonMedicalConsumptionLog> {
    const newLog: NonMedicalConsumptionLog = { ...newLogData, id: `nmc${Math.random()}` };
    nonMedicalConsumptionLogs.push(newLog);
    return newLog;
}

export async function createSupplyLog(newLogData: Omit<SupplyLog, 'id' | 'items'>): Promise<SupplyLog> {
    const newLog: SupplyLog = { ...newLogData, id: `sup${Math.random()}`, items: [] };
    supplyLogs.push(newLog);
    return newLog;
}

export async function addItemsToSupplyLog(supplyLogId: string, items: Omit<SuppliedItem, 'id' | 'supplyLogId' | 'medicineName'>[]): Promise<void> {
    const supplyLog = supplyLogs.find(sl => sl.id === supplyLogId);
    if (!supplyLog) {
        throw new Error("Supply log not found");
    }

    for (const item of items) {
        const medicine = medicines.find(m => m.id === item.medicineId);
        if (!medicine) throw new Error(`Medicine with id ${item.medicineId} not found`);

        const newItem: SuppliedItem = {
            ...item,
            id: `si${Math.random()}`,
            supplyLogId,
            medicineName: medicine.name,
        };
        supplyLog.items.push(newItem);

        // This is the part where we update the main inventory
        let inventoryItem = shipInventory[supplyLog.shipId]?.find(inv => inv.medicineId === item.medicineId);
        
        if (!inventoryItem) {
             const newInvItem: InventoryItem = {
                id: `inv${Math.random()}`,
                shipId: supplyLog.shipId,
                medicineId: item.medicineId,
                medicineName: medicine.name,
                medicineCategory: medicine.category || 'Uncategorized',
                type: medicine.type,
                requiredQuantity: 0, // Recalculated on getInventoryForShip
                totalQuantity: 0,
                batches: [],
            };
            if (!shipInventory[supplyLog.shipId]) {
              shipInventory[supplyLog.shipId] = [];
            }
            shipInventory[supplyLog.shipId].push(newInvItem);
            inventoryItem = newInvItem;
        }

        const newBatch: Batch = {
            id: `batch${Math.random()}`,
            inventoryItemId: inventoryItem.id,
            quantity: item.quantity,
            batchNumber: item.batchNumber,
            expiryDate: item.expiryDate,
            manufacturerName: item.manufacturerName,
        };

        inventoryItem.batches.push(newBatch);
    }
}


export async function getShipById(id: string): Promise<Ship | undefined> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return ships.find(s => s.id === id);
}

export async function createShip(newShipData: Omit<Ship, 'id'>): Promise<Ship> {
    const newShip: Ship = { ...newShipData, id: String(ships.length + 1) };
    ships.push(newShip);
    return newShip;
}

export async function addBatch(inventoryItemId: string, newBatchData: Omit<Batch, 'id' | 'inventoryItemId'>): Promise<Batch> {
    const { shipId } = await getShipAndInventoryItem(inventoryItemId);
    const newBatch = { ...newBatchData, id: `batch${Math.random()}`, inventoryItemId };
    const inventoryItem = shipInventory[shipId]?.find(i => i.id === inventoryItemId);
    if (inventoryItem) {
        inventoryItem.batches.push(newBatch);
    }
    return newBatch;
}


export async function updateBatch(batchId: string, updates: Partial<Omit<Batch, 'id' | 'inventoryItemId'>>): Promise<Batch> {
    const { inventoryItem, batch } = await getShipAndInventoryItem(undefined, batchId);

    if (inventoryItem && batch) {
        Object.assign(batch, updates);
        inventoryItem.totalQuantity = inventoryItem.batches.reduce((sum, b) => sum + b.quantity, 0);
        return batch;
    }
    throw new Error("Batch not found");
}


export async function deleteBatch(batchId: string): Promise<void> {
    const { inventoryItem, batchIndex } = await getShipAndInventoryItem(undefined, batchId);
    if (inventoryItem && batchIndex !== -1) {
        inventoryItem.batches.splice(batchIndex, 1);
        inventoryItem.totalQuantity = inventoryItem.batches.reduce((sum, b) => sum + b.quantity, 0);
        return;
    }
    throw new Error("Batch not found for deletion");
}


export async function updateFlagRequirement(flag: Flag, medicineId: string, updates: Partial<FlagRequirement>): Promise<void> {
    const reqs = flagRequirements[flag];
    if (reqs) {
        const req = reqs.find(r => r.medicineId === medicineId);
        if (req) {
            Object.assign(req, updates);
        } else {
             reqs.push({ medicineId, ...updates });
        }
    } else {
        flagRequirements[flag] = [{ medicineId, ...updates }];
    }
}

export async function createMedicine(newMedicineData: Omit<Medicine, 'id'> & { categoryA?: string, categoryB?: string, categoryC?: string, quantity?: string }): Promise<Medicine> {
     if (medicines.some(m => m.name.toLowerCase() === newMedicineData.name.toLowerCase())) {
        throw new Error(`An item with the name "${newMedicineData.name}" already exists.`);
    }
    const newMedicine = { ...newMedicineData, id: `med${Math.random()}` };
    medicines.push(newMedicine);

    // Add requirement for all flags
    for (const flag of Object.keys(flagRequirements) as Flag[]) {
        const newReq: FlagRequirement = { medicineId: newMedicine.id };
        if (newMedicine.type === 'Medicine') {
            newReq.categoryA = newMedicineData.categoryA || '0';
            newReq.categoryB = newMedicineData.categoryB || '0';
            newReq.categoryC = newMedicineData.categoryC || '0';
        } else {
            newReq.quantity = newMedicineData.quantity || '0';
        }
        flagRequirements[flag].push(newReq);
    }
    return newMedicine;
}

export async function updateMedicine(medicineId: string, updates: Partial<Medicine>): Promise<Medicine> {
    if (updates.name && medicines.some(m => m.name.toLowerCase() === updates.name?.toLowerCase() && m.id !== medicineId)) {
       throw new Error(`An item with the name "${updates.name}" already exists.`);
    }
    const medicine = medicines.find(m => m.id === medicineId);
    if (medicine) {
        Object.assign(medicine, updates);
        
        // Also update the name in all ship inventories
        for (const shipId in shipInventory) {
            const inventory = shipInventory[shipId];
            const itemToUpdate = inventory.find(i => i.medicineId === medicineId);
            if (itemToUpdate && updates.name) {
                itemToUpdate.medicineName = updates.name;
            }
        }
        return medicine;
    }
    throw new Error("Medicine not found");
}

export async function deleteMedicine(medicineId: string): Promise<void> {
    const index = medicines.findIndex(m => m.id === medicineId);
    if (index > -1) {
        medicines.splice(index, 1);

        // Remove from flag requirements
        for (const flag of Object.keys(flagRequirements) as Flag[]) {
            flagRequirements[flag] = flagRequirements[flag].filter(r => r.medicineId !== medicineId);
        }

        // Remove from ship inventories
        for (const shipId in shipInventory) {
            shipInventory[shipId] = shipInventory[shipId].filter(i => i.medicineId !== medicineId);
        }
        return;
    }
    throw new Error("Medicine not found for deletion");
}


// --- HELPER FUNCTIONS ---

export async function getShipAndInventoryItem(inventoryItemId?: string, batchId?: string) {
    for (const shipId in shipInventory) {
        const inventory = shipInventory[shipId];
        for (const item of inventory) {
            if (inventoryItemId && item.id === inventoryItemId) {
                return { shipId, inventoryItem: item, batch: undefined, batchIndex: -1 };
            }
            if (batchId) {
                const batchIndex = item.batches.findIndex(b => b.id === batchId);
                if (batchIndex !== -1) {
                    return { shipId, inventoryItem: item, batch: item.batches[batchIndex], batchIndex };
                }
            }
        }
    }
    throw new Error("Item not found");
}

export async function getInventoryItemById(inventoryItemId: string): Promise<InventoryItem | null> {
    for (const shipId in shipInventory) {
        const inventory = shipInventory[shipId];
        const item = inventory.find(i => i.id === inventoryItemId);
        if (item) {
            return item;
        }
    }
    return null;
}


export async function getBatchById(batchId: string): Promise<Batch | null> {
    for (const shipId in shipInventory) {
        const inventory = shipInventory[shipId];
        for (const item of inventory) {
            const batch = item.batches.find(b => b.id === batchId);
            if (batch) {
                return batch;
            }
        }
    }
    return null;
}

export async function getShipIdFromBatch(batchId: string): Promise<string | null> {
    for (const shipId in shipInventory) {
        const inventory = shipInventory[shipId];
        for (const item of inventory) {
             const batchExists = item.batches.some(b => b.id === batchId);
             if (batchExists) {
                 return shipId;
             }
        }
    }
    return null;
}

export async function getShipIdFromInventoryItem(inventoryItemId: string): Promise<string | null> {
     for (const shipId in shipInventory) {
        const inventory = shipInventory[shipId];
        const itemExists = inventory.some(i => i.id === inventoryItemId);
        if (itemExists) {
            return shipId;
        }
    }
    return null;
}

export async function addNonMandatoryItem(shipId: string, medicineId: string, newBatchData: Omit<Batch, 'id' | 'inventoryItemId'>): Promise<void> {
    if (!shipInventory[shipId]) {
        shipInventory[shipId] = [];
    }

    let inventoryItem = shipInventory[shipId].find(item => item.medicineId === medicineId);

    if (!inventoryItem) {
        const medicine = await getMedicines().then(meds => meds.find(m => m.id === medicineId));
        if (!medicine) throw new Error("Medicine not found");
        
        inventoryItem = {
            id: `inv${Math.random()}`,
            shipId,
            medicineId,
            medicineName: medicine.name,
            medicineCategory: medicine.category || 'Uncategorized',
            type: medicine.type,
            requiredQuantity: 0,
            totalQuantity: 0,
            batches: [],
        };
        shipInventory[shipId].push(inventoryItem);
    }
    
    const newBatch = { ...newBatchData, id: `batch${Math.random()}`, inventoryItemId: inventoryItem.id };
    inventoryItem.batches.push(newBatch);
    inventoryItem.totalQuantity = inventoryItem.batches.reduce((sum, b) => sum + b.quantity, 0);
}

export async function updatePharmacistDetails(newDetails: PharmacistDetails): Promise<void> {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'certificate-data.ts');
    const fileContent = `
export interface PharmacistDetails {
    name: string;
    licenseNumber: string;
    signature: string;
    supplier: {
        name: string;
        address: string;
        stateLicense: string;
        tel: string;
    };
}

export const pharmacistDetails: PharmacistDetails = ${JSON.stringify(newDetails, null, 4)};
`;
    await fs.writeFile(filePath, fileContent.trim());
}
    
