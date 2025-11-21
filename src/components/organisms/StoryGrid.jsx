import React from "react"
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