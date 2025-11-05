
"use client";

import { DataProvider } from "@/context/DataProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (

        <DataProvider>{children}</DataProvider>

  );
}
