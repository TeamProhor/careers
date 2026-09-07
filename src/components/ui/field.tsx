import type * as React from "react";
import { cn } from "@/lib/utils";

function Field({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

function FieldLabel({ className, ...props }: React.ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: Reusable label component, htmlFor passed via props
    <label
      data-slot="field-label"
      className={cn("text-xs font-medium leading-none", className)}
      {...props}
    />
  );
}

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

function FieldLegend({
  className,
  variant = "label",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "label" | "legend" }) {
  return (
    <legend
      data-slot="field-legend"
      className={cn(variant === "label" && "text-xs font-medium", className)}
      {...props}
    />
  );
}

export { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet };
