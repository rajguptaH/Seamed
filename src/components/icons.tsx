import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L12 22" />
      <path d="M2 12L22 12" />
      <path d="M17 2L17 7" />
      <path d="M7 17L7 22" />
      <path d="M20 17L22 17" />
      <path d="M2 7L4 7" />
    </svg>
  );
}
