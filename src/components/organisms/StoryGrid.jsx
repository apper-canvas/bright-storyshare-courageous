import React, { useState, useEffect } from "react"
import { notificationService } from "@/services/api/notificationService"

// Notification Badge Component
const NotificationBadge = () => {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const count = await notificationService.getUnreadCount()
        setUnreadCount(count)
      } catch (error) {
        console.error('Failed to load notification count:', error)
      }
    }

    loadUnreadCount()
    
    // Set up interval to check for new notifications
    const interval = setInterval(loadUnreadCount, 30000) // Check every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  if (unreadCount === 0) return null

  return (
    <span className="absolute -top-1 -right-1 bg-error text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  )
}

// Export for use in Header
export { NotificationBadge }
import StoryCard from "@/components/molecules/StoryCard"
import Loading from "@/components/ui/Loading"
import Empty from "@/components/ui/Empty"
import ErrorView from "@/components/ui/ErrorView"

const StoryGrid = ({ 
  stories, 
  loading, 
  error, 
  onRetry, 
  onLike,
  emptyType = "stories",
  showDescription = false
}) => {
  if (loading) {
    return <Loading type="cards" />
  }

  if (error) {
    return <ErrorView message={error} onRetry={onRetry} />
  }

  if (!stories || stories.length === 0) {
    return <Empty type={emptyType} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stories.map((story) => (
        <StoryCard
          key={story.Id}
          story={story}
          onLike={onLike}
          showDescription={showDescription}
        />
      ))}
    </div>
  )
}

export default StoryGrid