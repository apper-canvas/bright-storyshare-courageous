import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { storyService } from "@/services/api/storyService";
import { chapterService } from "@/services/api/chapterService";
import { libraryService } from "@/services/api/libraryService";
import { authorFollowService } from "@/services/api/authorFollowService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import ChapterListItem from "@/components/molecules/ChapterListItem";
import { calculateReadingTime, formatDate, formatNumber, getGenreColor } from "@/utils/formatters";

const StoryDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isLiked, setIsLiked] = useState(false)
const [likeCount, setLikeCount] = useState(0)
  const [libraryStatus, setLibraryStatus] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  useEffect(() => {
    if (id) {
      loadStoryDetails()
    }
  }, [id])

  const loadStoryDetails = async () => {
    try {
      setLoading(true)
      setError("")
const [storyData, chaptersData] = await Promise.all([
        storyService.getById(id),
        chapterService.getByStoryId(id)
      ])
      
      setStory(storyData)
      setChapters(chaptersData.filter(ch => ch.published))
      setLikeCount(storyData.likeCount)

      // Check follow status and follower count
      const followStatus = await authorFollowService.isFollowing(storyData.authorId)
      const followCount = await authorFollowService.getFollowerCount(storyData.authorId)
      setIsFollowing(followStatus)
      setFollowerCount(followCount)

      // Mock library status check
      const mockLibraryItem = await libraryService.getByStoryId(id)
      if (mockLibraryItem) {
        setLibraryStatus(mockLibraryItem.status)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    const newLiked = !isLiked
    setIsLiked(newLiked)
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1)
    toast.success(newLiked ? "Story liked!" : "Story unliked!")
  }

  const handleAddToLibrary = async (status) => {
    try {
      await libraryService.addToLibrary(id, status)
      setLibraryStatus(status)
      toast.success(`Added to ${status.replace("-", " ")}!`)
    } catch (err) {
      toast.error("Failed to add to library")
    }
  }

  const handleRemoveFromLibrary = async () => {
    try {
      await libraryService.removeFromLibrary(id)
      setLibraryStatus(null)
      toast.success("Removed from library")
    } catch (err) {
      toast.error("Failed to remove from library")
    }
  }
const handleStartReading = () => {
    if (chapters.length > 0) {
      navigate(`/story/${id}/chapter/${chapters[0].Id}`)
    }
  }

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await authorFollowService.unfollow(story.authorId)
        setIsFollowing(false)
        setFollowerCount(prev => Math.max(0, prev - 1))
        toast.success(`Unfollowed ${story.authorName}`)
      } else {
        await authorFollowService.follow(story.authorId, story.authorName)
        setIsFollowing(true)
        setFollowerCount(prev => prev + 1)
        toast.success(`Following ${story.authorName}`)
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error)
      toast.error('Failed to update follow status')
    }
  }

  if (loading) {
    return <Loading type="page" />
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadStoryDetails} fullPage />
  }

  if (!story) {
    return <ErrorView message="Story not found" fullPage />
  }

  const totalReadingTime = chapters.reduce((total, chapter) => {
    return total + calculateReadingTime(chapter.content || "Sample content for reading time calculation.")
  }, 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Story Cover & Actions */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Cover Image */}
            <div className="aspect-[3/4] overflow-hidden rounded-lg shadow-card">
              <img
                src={story.coverImageUrl}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleStartReading}
                variant="primary"
                className="w-full inline-flex items-center justify-center gap-2 py-3"
                disabled={chapters.length === 0}
              >
                <ApperIcon name="Play" size={20} />
                {chapters.length === 0 ? "No Chapters Yet" : "Start Reading"}
              </Button>

              <div className="flex gap-2">
                <Button
                  onClick={handleLike}
                  variant={isLiked ? "primary" : "secondary"}
                  className="flex-1 inline-flex items-center justify-center gap-2"
                >
                  <ApperIcon 
                    name="Heart" 
                    size={16} 
                    className={isLiked ? "fill-current" : ""} 
                  />
                  {formatNumber(likeCount)}
                </Button>

                <div className="relative">
                  <Button
                    variant="secondary"
                    className="inline-flex items-center gap-2"
                    onClick={() => {
                      // Mock dropdown behavior
                      const status = libraryStatus ? null : "want-to-read"
                      if (status) {
                        handleAddToLibrary(status)
                      } else {
                        handleRemoveFromLibrary()
                      }
                    }}
                  >
                    <ApperIcon name="Plus" size={16} />
                    {libraryStatus ? "In Library" : "Add to Library"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Library Status */}
            {libraryStatus && (
              <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-success">
                  <ApperIcon name="Check" size={16} />
                  <span className="font-ui font-medium">
                    In your {libraryStatus.replace("-", " ")} list
                  </span>
                </div>
              </div>
            )}

            {/* Story Stats */}
            <div className="bg-surface/50 rounded-lg p-4 space-y-3">
              <h3 className="font-display font-semibold text-primary">Story Stats</h3>
              <div className="space-y-2 text-sm font-ui">
                <div className="flex justify-between">
                  <span className="text-secondary">Views</span>
                  <span className="text-primary font-semibold">
                    {formatNumber(story.viewCount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Likes</span>
                  <span className="text-primary font-semibold">
                    {formatNumber(likeCount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Chapters</span>
                  <span className="text-primary font-semibold">{chapters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Reading Time</span>
                  <span className="text-primary font-semibold">
                    ~{totalReadingTime} min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
              {story.title}
            </h1>
            
            <div className="flex items-center gap-4">
<Avatar name={story.authorName} size="default" />
              <div className="flex-1">
                <p className="font-ui font-semibold text-primary">
                  {story.authorName}
                </p>
                <p className="text-sm text-secondary font-ui">
                  Published {formatDate(story.createdAt)}
                </p>
                {followerCount > 0 && (
                  <p className="text-xs text-secondary font-ui">
                    {formatNumber(followerCount)} followers
                  </p>
                )}
              </div>
              <Button
                variant={isFollowing ? "secondary" : "primary"}
                size="sm"
                onClick={handleFollowToggle}
                className="shrink-0"
              >
                <ApperIcon 
                  name={isFollowing ? "UserMinus" : "UserPlus"} 
                  size={16} 
                  className="mr-1"
                />
                {isFollowing ? "Following" : "Follow"}
</Button>
            </div>
          </div>

          {/* Genres and Status */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {story.genres.map((genre) => (
                <Badge
                  key={genre}
                  variant="genre"
                  className={getGenreColor(genre)}
                >
                  {genre}
                </Badge>
              ))}
              <Badge variant="secondary" size="sm">
                {story.contentRating || "General"}
              </Badge>
              <Badge 
                variant={story.status === "completed" ? "success" : "primary"}
                size="sm"
              >
                {story.status === "completed" ? "Completed" : "Ongoing"}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-xl font-display font-semibold text-primary mb-4">
              Synopsis
            </h2>
            <p className="text-secondary font-ui leading-relaxed">
              {story.description}
            </p>
          </div>

          {/* Chapters */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-display font-semibold text-primary">
                Chapters ({chapters.length})
              </h2>
              
              {chapters.length > 0 && (
                <Button
                  onClick={handleStartReading}
                  variant="primary"
                  size="sm"
                  className="inline-flex items-center gap-2"
                >
                  <ApperIcon name="Play" size={14} />
                  Start Reading
                </Button>
              )}
            </div>

            {chapters.length === 0 ? (
              <Empty
                type="chapters"
                title="No chapters published yet"
                description="This story is just getting started. Check back soon for the first chapter!"
              />
            ) : (
              <div className="space-y-4">
                {chapters.map((chapter) => (
                  <ChapterListItem
                    key={chapter.Id}
                    chapter={chapter}
                    storyId={story.Id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoryDetail