import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import StoryGrid from "@/components/organisms/StoryGrid"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Empty from "@/components/ui/Empty"
import { libraryService } from "@/services/api/libraryService"
import { storyService } from "@/services/api/storyService"
import { readingListService } from "@/services/api/readingListService"
import { cn } from "@/utils/cn"

const Library = () => {
const navigate = useNavigate()
  const [library, setLibrary] = useState([])
  const [stories, setStories] = useState([])
  const [readingLists, setReadingLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("currently-reading")
  useEffect(() => {
loadLibrary()
  }, [])

  const loadLibrary = async () => {
    try {
      setLoading(true)
      setError("")
      const [libraryData, storiesData, readingListsData] = await Promise.all([
        libraryService.getAll(),
        storyService.getAll(),
        readingListService.getAll()
      ])
      
      setLibrary(libraryData)
      setStories(storiesData)
      setReadingLists(readingListsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStoriesByStatus = (status) => {
    const libraryItems = library.filter(item => item.status === status)
    return libraryItems.map(item => 
      stories.find(story => story.Id === item.storyId)
    ).filter(Boolean)
  }

  const handleLikeStory = async (storyId, liked) => {
    try {
      setStories(prev => prev.map(story =>
        story.Id === storyId
          ? { ...story, likeCount: liked ? story.likeCount + 1 : story.likeCount - 1 }
          : story
      ))
    } catch (err) {
      console.error("Failed to like story:", err)
    }
  }

  const handleRemoveFromLibrary = async (storyId) => {
    try {
      await libraryService.removeFromLibrary(storyId)
      setLibrary(prev => prev.filter(item => item.storyId !== storyId))
    } catch (err) {
      console.error("Failed to remove from library:", err)
    }
  }

const tabs = [
    { 
      key: "currently-reading", 
      label: "Currently Reading", 
      icon: "BookOpen",
      stories: getStoriesByStatus("currently-reading")
    },
    { 
      key: "want-to-read", 
      label: "Want to Read", 
      icon: "Bookmark",
      stories: getStoriesByStatus("want-to-read")
    },
    { 
      key: "completed", 
      label: "Completed", 
      icon: "CheckCircle",
      stories: getStoriesByStatus("completed")
    },
    {
      key: "reading-lists",
      label: "Reading Lists",
      icon: "List",
      lists: readingLists
    }
  ]

  const activeTabData = tabs.find(tab => tab.key === activeTab)

  if (loading) {
    return <Loading type="page" />
  }

return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
          Your Library
        </h1>
        <p className="text-lg text-secondary font-ui">
          Organize and track your reading journey
        </p>
        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/reading-lists')}
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            Manage Reading Lists
          </Button>
        </div>
      </div>

{/* Library Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className="bg-gradient-to-br from-surface to-surface/80 rounded-lg p-6 text-center"
          >
            <div className="w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
              <ApperIcon name={tab.icon} size={24} className="text-accent" />
            </div>
            <h3 className="font-display text-xl font-semibold text-primary mb-2">
              {tab.key === 'reading-lists' ? tab.lists?.length || 0 : tab.stories?.length || 0}
            </h3>
            <p className="text-secondary font-ui text-sm">
              {tab.label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-surface">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 font-ui font-medium border-b-2 transition-colors",
              activeTab === tab.key
                ? "border-accent text-accent"
                : "border-transparent text-secondary hover:text-primary hover:border-surface"
            )}
          >
            <ApperIcon name={tab.icon} size={16} />
            {tab.label}
<Badge variant="genre" size="sm">
              {tab.key === 'reading-lists' ? tab.lists?.length || 0 : tab.stories?.length || 0}
            </Badge>
          </button>
        ))}
      </div>

{/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "reading-lists" ? (
          <div className="space-y-6">
            {readingLists.length === 0 ? (
              <Empty 
                type="library"
                title="No reading lists yet"
                description="Create custom reading lists to organize your stories by theme, mood, or any way you like."
                actionLabel="Create Reading List"
                onAction={() => navigate('/reading-lists')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {readingLists.map((list) => (
                  <div
                    key={list.Id}
                    className="bg-gradient-to-br from-surface to-surface/80 rounded-lg p-6 hover:shadow-card-hover transition-shadow cursor-pointer"
                    onClick={() => navigate('/reading-lists')}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                        <ApperIcon name="List" size={24} className="text-accent" />
                      </div>
                      <Badge variant="genre" size="sm">
                        {list.storyIds.length} stories
                      </Badge>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-primary mb-2">
                      {list.name}
                    </h3>
                    <p className="text-secondary font-ui text-sm line-clamp-3">
                      {list.description || "No description"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
) : activeTabData?.stories?.length === 0 ? (
          <Empty 
type="library"
            title={`No ${activeTabData?.label?.toLowerCase() || 'library'} stories`}
            description={
              activeTab === "currently-reading" 
                ? "Add stories to your library and start reading to populate this section."
                : activeTab === "want-to-read"
                ? "Browse stories and add them to your want to read list."
                : "Complete reading stories to see them here."
            }
            actionLabel="Browse Stories"
            onAction={() => window.location.href = "/"}
          />
        ) : (
          <StoryGrid
stories={activeTabData?.stories || []}
            loading={false}
            error={error}
            onRetry={loadLibrary}
            onLike={handleLikeStory}
            emptyType="library"
            showDescription={true}
          />
        )}
      </div>

      {/* Reading Progress Section */}
{activeTab === "currently-reading" && activeTabData?.stories?.length > 0 && (
        <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg p-6">
          <h3 className="text-xl font-display font-semibold text-primary mb-4">
            Your Reading Progress
          </h3>
          <div className="space-y-4">
{activeTabData?.stories?.slice(0, 3).map((story) => {
              const progress = Math.floor(Math.random() * 80) + 10 // Mock progress
              return (
                <div key={story.Id} className="flex items-center gap-4">
                  <img
                    src={story.coverImageUrl}
                    alt={story.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-display font-semibold text-primary">
                      {story.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-surface rounded-full h-2">
                        <div 
                          className="bg-accent rounded-full h-2 transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-secondary font-ui">
                        {progress}%
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Library