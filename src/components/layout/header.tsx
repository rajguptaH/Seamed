
'use client';

import Link from "next/link";
import { Logo } from "../icons";

export function Header({ children }: { children?: React.ReactNode }) {

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 print:hidden">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold md:text-base text-primary"
        >
          <Logo className="h-6 w-6" />
          <span className="font-headline">SeaMed Inventory</span>
        </Link>
      </nav>
      <div className="flex w-full items-center justify-between gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex items-center gap-4">
          {children}
        </div>
      </div>
    </header>
  );
}
