
"use client";

import { ShipList } from '@/components/ships/ship-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ICompany, IShip } from '@/types';
import { useState } from 'react';
import { EditCompanyDialog } from './edit-company-dialog';

interface CompanyDashboardProps {
  companies: ICompany[];
  ships: IShip[];
}

export function CompanyDashboard({ companies, ships }: CompanyDashboardProps) {
  const [activeCompanyId, setActiveCompanyId] = useState(companies[0]?._id);

  if (companies.length === 0) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>My Fleet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground p-8">
            <p className="text-lg">No companies found.</p>
            <p>You need to create a company before you can add ships.</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  const activeCompany = companies.find(c => c._id === activeCompanyId);

  return (
    <Card>
       <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle>My Fleet</CardTitle>
                    <CardDescription>
                        Select a company to view and manage its fleet of vessels.
                    </CardDescription>
                </div>
                {activeCompany && (
                   <EditCompanyDialog company={activeCompany} />
                )}
            </div>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue={companies[0]._id} onValueChange={setActiveCompanyId} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-auto">
                {companies.map((company) => (
                <TabsTrigger key={company._id} value={company._id}>{company.name}</TabsTrigger>
                ))}
            </TabsList>
            {companies.map((company) => (
                <TabsContent key={company._id} value={company._id} className="mt-4">
                    <ShipList ships={ships.filter(ship => ship.companyId === company._id)} />
                </TabsContent>
            ))}
            </Tabs>
      </CardContent>
    </Card>
  );
}
