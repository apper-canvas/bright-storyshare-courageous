import React from "react"
import { cn } from "@/utils/cn"

const Card = ({ 
  children, 
  variant = "default", 
  hover = false,
  className,
  onClick 
}) => {
  const baseClasses = "bg-surface rounded-lg transition-all duration-200"
  
  const variants = {
    default: "shadow-card",
    elevated: "shadow-elevated",
    flat: "border border-surface"
  }
  
  const hoverClasses = hover ? "hover:shadow-card-hover hover:transform hover:scale-[1.02] cursor-pointer" : ""

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant], 
        hoverClasses,
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card