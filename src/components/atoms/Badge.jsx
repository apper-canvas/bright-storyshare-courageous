import React from "react"
import { cn } from "@/utils/cn"

const Badge = ({ 
  children, 
  variant = "default", 
  size = "default",
  className 
}) => {
  const baseClasses = "inline-flex items-center font-ui font-medium rounded-full"
  
  const variants = {
    default: "bg-surface text-secondary",
    primary: "bg-accent text-white",
    secondary: "bg-secondary text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white", 
    error: "bg-error text-white",
    genre: "bg-gradient-to-r from-accent/10 to-accent/5 text-accent border border-accent/20"
  }
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base"
  }

  return (
    <span
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}

export default Badge