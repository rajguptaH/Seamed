
import { Header } from "@/components/layout/header";
import { NewShipDialog } from "@/components/ships/new-ship-dialog";
import { getCompanies } from "@/lib/data";
import { NewCompanyDialog } from "@/components/companies/new-company-dialog";
import { Button } from "@/components/ui/button";
import { Bot, FileText, Settings } from "lucide-react";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const companies = await getCompanies();
  return (
    <div className="flex min-h-screen w-full flex-col">
       <Header>
        <div className="print:hidden">
          <Button asChild variant="outline" size="sm" className="h-8 gap-1">
            <Link href="/certificate">
              <FileText className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Generate Certificate
                </span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 gap-1">
            <Link href="/ai-assistant">
              <Bot className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  AI Assistant
                </span>
            </Link>
          </Button>
           <Button asChild variant="outline" size="sm" className="h-8 gap-1">
            <Link href="/dashboard/settings">
              <Settings className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Settings
                </span>
            </Link>
          </Button>
          <NewCompanyDialog />
          <NewShipDialog companies={companies} />
        </div>
      </Header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 print:hidden">
        {children}
      </main>
    </div>
  );
}
