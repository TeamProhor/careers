import { cn } from "@/lib/utils";

interface DecorIconProps {
  className?: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function DecorIcon({ className, position }: DecorIconProps) {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
  };

  return (
    <svg
      className={cn("absolute", positionClasses[position], className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14M12 5v14" />
    </svg>
  );
}
