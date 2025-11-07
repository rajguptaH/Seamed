"use client";
import { CertificateGenerator } from "@/components/certificate/certificate-generator";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { useData } from "@/context/DataProvider";
import { API_ENTITIES, API_ROUTES } from "@/utils/routes";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";


export default  function CertificatePage() {
   const { data,fetchEntity } = useData();

  useEffect(() => {
    fetchEntity(API_ENTITIES.ships, API_ROUTES.ships);
  }, [fetchEntity]);


  const ships = useMemo(() => data.ships || [], [data.ships]);
  return (
    <div className="flex min-h-screen w-full flex-col print:hidden">
       <Header>
        <div className="print:hidden">
          <Button asChild variant="outline" size="sm" className="h-8 gap-1">
            <Link href="/dashboard">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Back to Dashboard
              </span>
            </Link>
          </Button>
        </div>
      </Header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 w-full max-w-4xl mx-auto">
        <CertificateGenerator ships={ships} />
      </main>
    </div>
  );
}
