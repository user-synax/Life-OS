"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:shadow-[rgba(0,0,0,0.1)_0px_4px_12px] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "rounded-[9999px] bg-[#0f0f0f] text-[#fafafa] border-[1px_solid_#fafafa] hover:bg-[#0f0f0f]/90",
        outline:
          "rounded-[6px] border-[#2e2e2e] bg-[#0f0f0f] text-[#fafafa] hover:bg-[#2e2e2e] hover:text-[#fafafa] aria-expanded:bg-[#2e2e2e] aria-expanded:text-[#fafafa]",
        secondary:
          "rounded-[9999px] bg-[#0f0f0f] text-[#fafafa] border-[1px_solid_#2e2e2e] opacity-80 hover:opacity-100 aria-expanded:bg-[#0f0f0f] aria-expanded:text-[#fafafa]",
        ghost:
          "rounded-[6px] bg-transparent text-[#fafafa] border-[1px_solid_transparent] hover:bg-[#2e2e2e] hover:text-[#fafafa] aria-expanded:bg-[#2e2e2e] aria-expanded:text-[#fafafa]",
        destructive:
          "rounded-[6px] bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-[#00c573] underline-offset-4 hover:underline rounded-none border-none",
      },
      size: {
        default:
          "h-9 gap-2 px-8",
        xs: "h-7 gap-1 px-2 text-xs",
        sm: "h-8 gap-1.5 px-3 text-sm",
        lg: "h-10 gap-2 px-8 text-base",
        icon: "size-9",
        "icon-xs": "size-7",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
