import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ship as ShipIcon, Users, Flag, Badge } from "lucide-react";
import type { Ship } from "@/types";
import { Badge as BadgeComponent } from "@/components/ui/badge";

export function ShipCard({ ship }: { ship: Ship }) {
  return (
    <Link href={`/ships/${ship.id}`}>
      <Card className="hover:shadow-md hover:border-primary/50 transition-all duration-300 h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium font-headline">
            {ship.name}
          </CardTitle>
          <ShipIcon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
           <div className="flex items-center gap-2 mb-2">
            <BadgeComponent variant="secondary">Category {ship.category}</BadgeComponent>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>IMO: {ship.imo}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4" />
                <span>{ship.flag}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{ship.crewCount} Crew</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
