import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default",
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-ui font-medium transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]",
    secondary: "border-2 border-secondary text-secondary hover:bg-secondary hover:text-white",
    ghost: "text-secondary hover:bg-surface hover:text-primary",
    danger: "bg-gradient-to-r from-error to-error/90 hover:from-error/90 hover:to-error text-white shadow-md hover:shadow-lg"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    default: "px-4 py-2 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-lg"
  }

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button