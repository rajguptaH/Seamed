// app/ships/[id]/page.tsx
import ShipDetailsClient from "@/components/ships/ShipDetailsClient";

export default function ShipDetailsPage({ params }: { params: { id: string } }) {
  return <ShipDetailsClient shipId={params.id} />;
}
