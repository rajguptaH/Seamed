
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ship, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardSummaryProps {
    totalShips: number;
    shipsNeedingAttention: number;
    shipsNeedingAttentionNames: string[];
    totalCrew: number;
}

export function DashboardSummary({ totalShips, shipsNeedingAttention, shipsNeedingAttentionNames, totalCrew }: DashboardSummaryProps) {
  return (
    <>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vessels</CardTitle>
                <Ship className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalShips}</div>
                <p className="text-xs text-muted-foreground">in your fleet</p>
            </CardContent>
        </Card>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={shipsNeedingAttention > 0 ? "/dashboard?filter=needs_attention" : "#"} className={shipsNeedingAttention > 0 ? "cursor-pointer" : "cursor-default"}>
                        <Card className="hover:border-primary/50 transition-colors h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{shipsNeedingAttention}</div>
                                <p className="text-xs text-muted-foreground">vessels with items expiring soon</p>
                            </CardContent>
                        </Card>
                    </Link>
                </TooltipTrigger>
                {shipsNeedingAttention > 0 && (
                    <TooltipContent>
                        <p className="font-semibold mb-1">Vessels needing attention:</p>
                        <ul className="list-disc list-inside">
                            {shipsNeedingAttentionNames.map(name => <li key={name}>{name}</li>)}
                        </ul>
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Crew</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalCrew}</div>
                <p className="text-xs text-muted-foreground">across the fleet</p>
            </CardContent>
        </Card>
    </>
  );
}
