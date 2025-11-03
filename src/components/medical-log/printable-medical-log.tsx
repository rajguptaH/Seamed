
"use client";

import type { MedicalLog, Ship, Company } from "@/types";
import { format } from "date-fns";
import { Logo } from "../icons";

interface PrintableMedicalLogProps {
  logs: MedicalLog[];
  ship: Ship;
  company?: Company;
  getMedicineName: (medicineId: string | null | undefined) => string;
}

export function PrintableMedicalLog({ logs, ship, company, getMedicineName }: PrintableMedicalLogProps) {
  return (
    <div className="hidden print:block p-8 font-sans text-gray-800">
      <header className="mb-8 border-b pb-4">
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-baseline gap-4">
                  <h1 className="text-3xl font-bold text-gray-900">{ship.name} - Medical Log</h1>
                  {company?.medicalLogFormNumber && (
                    <p className="text-sm text-gray-500">Form: {company.medicalLogFormNumber}</p>
                  )}
                </div>
                <p className="text-lg text-gray-600">Official Record of Medical Incidents</p>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
                <Logo className="h-8 w-8" />
                <span className="font-bold text-xl">SeaMed Inventory</span>
            </div>
        </div>
      </header>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Vessel Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="font-semibold">Vessel Name:</p>
            <p>{ship.name}</p>
          </div>
          <div>
            <p className="font-semibold">IMO Number:</p>
            <p>{ship.imo}</p>
          </div>
          <div>
            <p className="font-semibold">Flag State:</p>
            <p>{ship.flag}</p>
          </div>
          <div>
            <p className="font-semibold">Vessel Category:</p>
            <p>Category {ship.category}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Log Entries</h2>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-gray-400 bg-gray-100">
              <th className="p-2">Date</th>
              <th className="p-2">Crew Member</th>
              <th className="p-2">Rank</th>
              <th className="p-2">Case Description</th>
              <th className="p-2">Medicine Provided</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Batch #</th>
              <th className="p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-200">
                  <td className="p-2 align-top">{format(new Date(log.date), "yyyy-MM-dd")}</td>
                  <td className="p-2 align-top">{log.crewMemberName}</td>
                  <td className="p-2 align-top">{log.rank}</td>
                  <td className="p-2 align-top">{log.caseDescription}</td>
                  <td className="p-2 align-top">{getMedicineName(log.medicineUsedId)}</td>
                  <td className="p-2 align-top">{log.quantityUsed ?? 'N/A'}</td>
                  <td className="p-2 align-top">{log.batchNumber || 'N/A'}</td>
                  <td className="p-2 align-top">{log.notes || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  No medical log entries found for the selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
      
      <footer className="mt-12 pt-4 border-t text-center text-xs text-gray-500">
         <p>SeaMed Inventory Solutions</p>
      </footer>
    </div>
  );
}
