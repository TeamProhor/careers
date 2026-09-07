import { cn } from "@/lib/utils";

interface GridPatternProps {
  className?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cr?: number;
}

export function GridPattern({
  className,
  width = 40,
  height = 40,
  x = 0,
  y = 0,
  cr = 0,
  ...props
}: GridPatternProps) {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 size-full",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={`grid-${width}-${height}-${x}-${y}`}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M ${width + cr} 0 L ${width} 0 L ${width} ${cr} M ${width} ${height - cr} L ${width} ${height} L ${width - cr} ${height} M ${cr} ${height} L 0 ${height} L 0 ${height - cr} M 0 ${cr} L 0 0 L ${cr} 0`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#grid-${width}-${height}-${x}-${y})`}
      />
    </svg>
  );
}
