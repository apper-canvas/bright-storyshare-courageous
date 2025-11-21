import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Textarea = forwardRef(({ 
  className, 
  label,
  error,
  rows = 4,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-ui font-medium text-primary">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          "w-full px-3 py-2 font-ui text-base text-primary bg-white border border-surface rounded-lg transition-colors duration-200 resize-y",
          "placeholder:text-secondary/50",
          "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
          "disabled:bg-surface disabled:cursor-not-allowed",
          error && "border-error focus:ring-error focus:border-error",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-error font-ui">{error}</p>
      )}
    </div>
  )
})

Textarea.displayName = "Textarea"

export default Textarea