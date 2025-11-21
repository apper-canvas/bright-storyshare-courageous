import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import CommentSection from "@/components/organisms/CommentSection"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import { storyService } from "@/services/api/storyService"
import { chapterService } from "@/services/api/chapterService"
import { formatDate, formatNumber, calculateReadingTime } from "@/utils/formatters"
import { toast } from "react-toastify"

const ChapterRead = () => {
  const { storyId, chapterId } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [chapter, setChapter] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    if (storyId && chapterId) {
      loadChapterData()
    }
  }, [storyId, chapterId])

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrolled / maxScroll) * 100
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const loadChapterData = async () => {
    try {
      setLoading(true)
      setError("")
      const [storyData, chapterData, chaptersData] = await Promise.all([
        storyService.getById(storyId),
        chapterService.getById(chapterId),
        chapterService.getByStoryId(storyId)
      ])
      
      setStory(storyData)
      setChapter(chapterData)
      setChapters(chaptersData.filter(ch => ch.published))
      setLikeCount(chapterData.likeCount)
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
    toast.success(newLiked ? "Chapter liked!" : "Chapter unliked!")
  }

  const getCurrentChapterIndex = () => {
    return chapters.findIndex(ch => ch.Id === parseInt(chapterId))
  }

  const getPreviousChapter = () => {
    const currentIndex = getCurrentChapterIndex()
    return currentIndex > 0 ? chapters[currentIndex - 1] : null
  }

  const getNextChapter = () => {
    const currentIndex = getCurrentChapterIndex()
    return currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null
  }

  const navigateToChapter = (targetChapter) => {
    if (targetChapter) {
      navigate(`/story/${storyId}/chapter/${targetChapter.Id}`)
    }
  }

  if (loading) {
    return <Loading type="chapter" />
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadChapterData} fullPage />
  }

  if (!story || !chapter) {
    return <ErrorView message="Chapter not found" fullPage />
  }

  const previousChapter = getPreviousChapter()
  const nextChapter = getNextChapter()
  const currentIndex = getCurrentChapterIndex()
  const readingTime = calculateReadingTime(chapter.content)

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar */}
      <div
        className="progress-line"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Chapter Header */}
      <div className="bg-surface/50 border-b border-surface sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/story/${storyId}`)}
                className="inline-flex items-center gap-2"
              >
                <ApperIcon name="ArrowLeft" size={16} />
                Back to Story
              </Button>
              
              <div className="hidden md:block">
                <h2 className="font-display text-lg font-semibold text-primary">
                  {story.title}
                </h2>
                <p className="text-sm text-secondary font-ui">
                  Chapter {chapter.orderIndex}: {chapter.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Chapter Navigation */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToChapter(previousChapter)}
                disabled={!previousChapter}
                className="inline-flex items-center gap-1"
              >
                <ApperIcon name="ChevronLeft" size={16} />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              
              <span className="text-sm text-secondary font-ui px-2">
                {currentIndex + 1} of {chapters.length}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToChapter(nextChapter)}
                disabled={!nextChapter}
                className="inline-flex items-center gap-1"
              >
                <span className="hidden sm:inline">Next</span>
                <ApperIcon name="ChevronRight" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 reading-scroll">
        <article className="space-y-8">
          {/* Chapter Title */}
          <header className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
              Chapter {chapter.orderIndex}: {chapter.title}
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-sm text-secondary font-ui">
              <span className="flex items-center gap-1">
                <ApperIcon name="Clock" size={14} />
                {readingTime} min read
              </span>
              <span className="flex items-center gap-1">
                <ApperIcon name="Calendar" size={14} />
                {formatDate(chapter.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <ApperIcon name="Eye" size={14} />
                {formatNumber(chapter.viewCount)} views
              </span>
            </div>
          </header>

          {/* Chapter Content */}
          <div className="reading-content prose prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{ 
                __html: chapter.content || `
                  <p>The morning sun filtered through the tall windows of the library, casting golden streaks across the dusty shelves. Sarah had always found solace in this quiet corner of the university, where the scent of old books and the soft whisper of turning pages created a world unto itself.</p>
                  
                  <p>She pulled her notebook closer, the pages filled with her careful handwriting. The research project that had seemed so daunting weeks ago was finally taking shape. Each source she discovered felt like finding a missing piece of a vast puzzle.</p>
                  
                  <p>"Excuse me, is this seat taken?"</p>
                  
                  <p>Sarah looked up to see a young man with kind eyes and tousled brown hair, gesturing to the chair across from her. She shook her head, offering a shy smile. "Please, go ahead."</p>
                  
                  <p>He settled into the chair with a stack of books that rivaled her own. As he opened the first tome, Sarah couldn't help but notice the careful way he handled each volume, as if they were precious artifacts.</p>
                  
                  <p>"Working on something interesting?" he asked quietly, noticing her curious glance.</p>
                  
                  <p>"Medieval literature," she whispered back. "You?"</p>
                  
                  <p>"Ancient history. Specifically, lost civilizations." His eyes lit up with genuine enthusiasm. "I'm Marcus, by the way."</p>
                  
                  <p>"Sarah." She found herself smiling more naturally now. "Lost civilizations sounds fascinating."</p>
                  
                  <p>And so began what would become daily meetings in their shared corner of the library, where two students discovered that sometimes the most important discoveries happen not in books, but in the connections we make while searching for knowledge.</p>
                ` 
              }}
            />
          </div>

          {/* Chapter Actions */}
          <div className="flex items-center justify-center gap-4 py-8 border-t border-surface">
            <Button
              onClick={handleLike}
              variant={isLiked ? "primary" : "secondary"}
              className="inline-flex items-center gap-2 bookmark-ribbon"
            >
              <ApperIcon 
                name="Heart" 
                size={16} 
                className={isLiked ? "fill-current heart-pulse" : ""} 
              />
              {formatNumber(likeCount)}
            </Button>
            
            <Button
              variant="secondary"
              className="inline-flex items-center gap-2 bookmark-ribbon"
              onClick={() => {
                navigator.share?.({
                  title: `${story.title} - Chapter ${chapter.orderIndex}`,
                  url: window.location.href
                }) || navigator.clipboard.writeText(window.location.href)
                toast.success("Link copied to clipboard!")
              }}
            >
              <ApperIcon name="Share" size={16} />
              Share
            </Button>
          </div>

          {/* Chapter Navigation */}
          <div className="flex justify-between items-center py-6 border-t border-surface">
            <div className="flex-1">
              {previousChapter && (
                <Button
                  onClick={() => navigateToChapter(previousChapter)}
                  variant="secondary"
                  className="inline-flex items-center gap-2"
                >
                  <ApperIcon name="ChevronLeft" size={16} />
                  <div className="text-left">
                    <div className="text-sm text-secondary">Previous</div>
                    <div className="font-semibold">Chapter {previousChapter.orderIndex}</div>
                  </div>
                </Button>
              )}
            </div>
            
            <Button
              onClick={() => navigate(`/story/${storyId}`)}
              variant="ghost"
              className="inline-flex items-center gap-2"
            >
              <ApperIcon name="List" size={16} />
              All Chapters
            </Button>
            
            <div className="flex-1 flex justify-end">
              {nextChapter && (
                <Button
                  onClick={() => navigateToChapter(nextChapter)}
                  variant="primary"
                  className="inline-flex items-center gap-2"
                >
                  <div className="text-right">
                    <div className="text-sm">Next</div>
                    <div className="font-semibold">Chapter {nextChapter.orderIndex}</div>
                  </div>
                  <ApperIcon name="ChevronRight" size={16} />
                </Button>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="py-8 border-t border-surface">
            <CommentSection chapterId={chapter.Id} />
          </div>
        </article>
      </div>
    </div>
  )
}

export default ChapterRead