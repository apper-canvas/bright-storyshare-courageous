import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ChapterListItem from "@/components/molecules/ChapterListItem";
import ChapterEditor from "@/components/organisms/ChapterEditor";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import { storyService } from "@/services/api/storyService";
import { chapterService } from "@/services/api/chapterService";
import { formatDate, formatNumber } from "@/utils/formatters";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const StoryEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("chapters")
  const [editingChapter, setEditingChapter] = useState(null)
  const [showEditor, setShowEditor] = useState(false)

  useEffect(() => {
    if (id) {
      loadStoryData()
    }
  }, [id])

  const loadStoryData = async () => {
    try {
      setLoading(true)
      setError("")
      const [storyData, chaptersData] = await Promise.all([
        storyService.getById(id),
        chapterService.getByStoryId(id)
      ])
      
      setStory(storyData)
      setChapters(chaptersData.sort((a, b) => a.orderIndex - b.orderIndex))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNewChapter = () => {
    setEditingChapter(null)
    setShowEditor(true)
  }

  const handleEditChapter = (chapter) => {
    setEditingChapter(chapter)
    setShowEditor(true)
  }

  const handleDeleteChapter = async (chapter) => {
    if (!window.confirm(`Are you sure you want to delete "${chapter.title}"?`)) {
      return
    }

    try {
      await chapterService.delete(chapter.Id)
      setChapters(prev => prev.filter(ch => ch.Id !== chapter.Id))
      toast.success("Chapter deleted successfully")
    } catch (err) {
      toast.error("Failed to delete chapter")
    }
  }

  const handleSaveChapter = async (chapterData) => {
    try {
      const orderIndex = editingChapter ? 
        editingChapter.orderIndex : 
        Math.max(0, ...chapters.map(ch => ch.orderIndex)) + 1

      const chapter = editingChapter ?
        await chapterService.update(editingChapter.Id, { ...chapterData, orderIndex }) :
        await chapterService.create({ 
          ...chapterData, 
          storyId: id, 
          orderIndex 
        })

      if (editingChapter) {
        setChapters(prev => prev.map(ch => 
          ch.Id === editingChapter.Id ? chapter : ch
        ))
      } else {
        setChapters(prev => [...prev, chapter])
      }

      toast.success(`Chapter ${editingChapter ? "updated" : "created"} successfully`)
    } catch (err) {
      toast.error(`Failed to ${editingChapter ? "update" : "create"} chapter`)
      throw err
    }
  }

  const handlePublishChapter = async (chapterData) => {
    try {
      await handleSaveChapter({ ...chapterData, published: true })
      setShowEditor(false)
      setEditingChapter(null)
      toast.success("Chapter published successfully!")
    } catch (err) {
      // Error already handled in handleSaveChapter
    }
  }

  const handleCancelEdit = () => {
    setShowEditor(false)
    setEditingChapter(null)
  }

  if (loading) {
    return <Loading type="page" />
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadStoryData} fullPage />
  }

  if (!story) {
    return <ErrorView message="Story not found" fullPage />
  }

  if (showEditor) {
    return (
      <ChapterEditor
        chapter={editingChapter}
        onSave={handleSaveChapter}
        onPublish={handlePublishChapter}
        onCancel={handleCancelEdit}
      />
    )
  }

  const publishedChapters = chapters.filter(ch => ch.published)
  const draftChapters = chapters.filter(ch => !ch.published)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Story Header */}
      <div className="flex items-start gap-6">
        <img
          src={story.coverImageUrl}
          alt={story.title}
          className="w-24 h-32 object-cover rounded-lg shadow-card"
        />
        
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary mb-2">
              {story.title}
            </h1>
            <p className="text-secondary font-ui">
              by {story.authorName} • Created {formatDate(story.createdAt)}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-ui">
            <div className="text-center p-3 bg-surface/50 rounded-lg">
              <div className="text-xl font-display font-bold text-primary">
                {chapters.length}
              </div>
              <div className="text-secondary">Total Chapters</div>
            </div>
            <div className="text-center p-3 bg-surface/50 rounded-lg">
              <div className="text-xl font-display font-bold text-primary">
                {publishedChapters.length}
              </div>
              <div className="text-secondary">Published</div>
            </div>
            <div className="text-center p-3 bg-surface/50 rounded-lg">
              <div className="text-xl font-display font-bold text-primary">
                {formatNumber(story.viewCount)}
              </div>
              <div className="text-secondary">Views</div>
            </div>
            <div className="text-center p-3 bg-surface/50 rounded-lg">
              <div className="text-xl font-display font-bold text-primary">
                {formatNumber(story.likeCount)}
              </div>
              <div className="text-secondary">Likes</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/story/${id}`)}
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Eye" size={16} />
            View Story
          </Button>
          <Button
            variant="primary"
            onClick={handleNewChapter}
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            New Chapter
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface">
        <nav className="flex space-x-8">
          {[
            { key: "chapters", label: "All Chapters", count: chapters.length },
            { key: "published", label: "Published", count: publishedChapters.length },
            { key: "drafts", label: "Drafts", count: draftChapters.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "py-3 px-1 border-b-2 font-ui font-medium text-sm transition-colors",
                activeTab === tab.key
                  ? "border-accent text-accent"
                  : "border-transparent text-secondary hover:text-primary hover:border-surface"
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {(() => {
          let filteredChapters = chapters
          if (activeTab === "published") {
            filteredChapters = publishedChapters
          } else if (activeTab === "drafts") {
            filteredChapters = draftChapters
          }

          if (filteredChapters.length === 0) {
            return (
              <Empty
                type={activeTab === "drafts" ? "drafts" : "chapters"}
                title={
                  activeTab === "drafts" ? "No draft chapters" :
                  activeTab === "published" ? "No published chapters" :
                  "No chapters yet"
                }
                description={
                  activeTab === "drafts" ? "Create and save draft chapters before publishing." :
                  activeTab === "published" ? "Publish your first chapter to see it here." :
                  "Start writing your story by creating your first chapter."
                }
                actionLabel="Write New Chapter"
                onAction={handleNewChapter}
              />
            )
          }

          return (
            <div className="space-y-4">
              {filteredChapters.map((chapter) => (
                <ChapterListItem
                  key={chapter.Id}
                  chapter={chapter}
                  storyId={story.Id}
                  canEdit={true}
                  onEdit={handleEditChapter}
                  onDelete={handleDeleteChapter}
                />
              ))}
            </div>
          )
        })()}
      </div>
    </div>
  )
}

export default StoryEdit