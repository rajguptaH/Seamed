
"use client";

import type { Ship } from "@/types";
import type { PharmacistDetails } from "@/lib/certificate-data";
import { format } from "date-fns";

interface PrintableCertificateProps {
  ship: Ship;
  pharmacist: PharmacistDetails;
  inspectionDate: Date;
  port: string;
}

export function PrintableCertificate({ ship, pharmacist, inspectionDate, port }: PrintableCertificateProps) {
  const expiryDate = new Date(inspectionDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  expiryDate.setDate(expiryDate.getDate() - 1);

  return (
    <div id="printable-certificate" className="font-serif text-black bg-white p-4">
        <div className="p-10 border-[10px] border-blue-200" style={{borderStyle: 'double', borderWidth: '10px', borderColor: '#bfdbfe'}}>
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold tracking-wider">Medical Chest Certificate</h1>
            </div>

            <div className="text-right mb-6">
                <p className="inline-block border border-black px-4 py-1 text-sm">No. {format(inspectionDate, 'yyyyMMdd')}001</p>
            </div>

            <div className="mb-6 leading-relaxed">
                <p>This vessel (S/S) <span className="font-bold border-b border-black px-4">{ship.name}</span> IMO No. <span className="font-bold border-b border-black px-4">{ship.imo}</span></p>
                <p>Medical chest and first aid equipment supplied for the voyage, has been inspected by</p>
                <p>Registered Pharmacist <span className="font-bold border-b border-black px-4">{pharmacist.name}</span> License No. <span className="font-bold border-b border-black px-4">{pharmacist.licenseNumber}</span></p>
                <p>On <span className="font-bold border-b border-black px-4">{format(inspectionDate, 'MMM.dd.yyyy').toUpperCase()}</span> in Port <span className="font-bold border-b border-black px-4">{port.toUpperCase()}</span>, and has been found in compliance with:</p>
            </div>

            <div className="mb-8 ml-8 text-sm space-y-2">
                <p>&diamond; U.S. DEPARTMENT OF HEALTH AND HUMAN SERVICES, The ship's Medicine Chest and Medical Aid at Sea and U.S. Section eight(8) of the Federal Act for the Government and Regulations of Seamen in Merchant Services. U.S.C.#660</p>
                <p>&#9734; IMO. WHO. ILO International Joint Committee on Health of Seafarers, International Medical Guide for ships(IMGS)Third edition and quantification Adden dum.and Medical First Aid Guide for Use in Accidents Involving Dangerous Goods (MFAG).</p>
                <p>&diamond; HONGKONG (HK"IA"), MERCANTILE MARINE OFFICE, Directorate of Marine and The Marine and The Merchant Shipping (Medical Scale Regulations) in accordance with Scale I,IA/IB,II,III,V.</p>
                <p>&diamond; NORWEGIAN MINISTRY OF HEALTH AND SOCIAL AFFAIRS and the Royal Degree of Regulations pursuant to the Seaworthiness Act.</p>
                <p>&diamond; OTHER</p>
            </div>

            <div className="overflow-auto clear-both">
                <div className="float-left text-center">
                    <p className="font-cursive text-2xl italic">{pharmacist.signature}</p>
                    <p className="border-t border-black pt-1 mt-1 text-sm">Registered Pharmacist Signature</p>
                    <p className="mt-4 text-sm">Certificate expiration date: <span className="font-bold">{format(expiryDate, 'MMM.dd.yyyy').toUpperCase()}</span></p>
                </div>
                
                <div className="float-right text-center text-xs w-1/3 border border-black p-2 rounded-lg relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <p className="text-6xl text-gray-200 font-bold opacity-50">SEAL</p>
                    </div>
                    <p><span className="font-bold">Suppliers Name:</span> {pharmacist.supplier.name}</p>
                    <p><span className="font-bold">Address:</span> {pharmacist.supplier.address}</p>
                    <p><span className="font-bold">State License:</span> {pharmacist.supplier.stateLicense}</p>
                    <p><span className="font-bold">TEL:</span> {pharmacist.supplier.tel}</p>
                </div>
            </div>

            <div className="mt-8 text-xs space-y-1 clear-both pt-4">
                <p>This certificate complies with all World Health Organization Regulations Governing Foreign Flag Vessels.</p>
                <p>REMARK **Electronic Copy to be considered valid as Original one**</p>
            </div>
        </div>
    </div>
  );
}
