import type { Ship } from "@/types";
import { ShipCard } from "./ship-card";

export function ShipList({ ships }: { ships: Ship[] }) {
  if (ships.length === 0) {
    return (
      <div className="col-span-full text-center text-muted-foreground p-8 border rounded-lg">
        <p className="text-lg">No ships found for this company.</p>
        <p>Click "Add New Ship" to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {ships.map((ship) => (
        <ShipCard key={ship._id} ship={ship} />
      ))}
    </div>
  );
}
