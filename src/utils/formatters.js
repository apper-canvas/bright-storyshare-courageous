import { format, formatDistanceToNow } from "date-fns"

export const formatDate = (date) => {
  return format(new Date(date), "MMM d, yyyy")
}

export const formatRelativeDate = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

export const generateAvatar = (name) => {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
}

export const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export const calculateReadingTime = (content) => {
  const wordsPerMinute = 200
  const words = content.split(" ").length
  const minutes = Math.ceil(words / wordsPerMinute)
  return minutes
}

export const formatContentRating = (rating) => {
  const ratings = {
    "general": "General",
    "teen": "Teen",
    "mature": "Mature",
    "explicit": "18+"
  }
  return ratings[rating] || "General"
}

export const getGenreColor = (genre) => {
  const colors = {
    "Romance": "bg-pink-100 text-pink-800",
    "Fantasy": "bg-purple-100 text-purple-800", 
    "Mystery": "bg-indigo-100 text-indigo-800",
    "Sci-Fi": "bg-blue-100 text-blue-800",
    "Teen Fiction": "bg-green-100 text-green-800",
    "Thriller": "bg-red-100 text-red-800",
    "Historical": "bg-yellow-100 text-yellow-800",
    "Contemporary": "bg-gray-100 text-gray-800"
  }
  return colors[genre] || "bg-gray-100 text-gray-800"
}