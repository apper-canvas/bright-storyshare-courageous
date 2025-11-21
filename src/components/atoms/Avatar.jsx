import React from "react"
import { cn } from "@/utils/cn"
import { generateAvatar } from "@/utils/formatters"

const Avatar = ({ 
  name, 
  src, 
  size = "default",
  className 
}) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    default: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl"
  }

  const initials = generateAvatar(name)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          "rounded-full object-cover",
          sizes[size],
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-accent to-accent/80 text-white font-ui font-semibold flex items-center justify-center",
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  )
}

export default Avatar