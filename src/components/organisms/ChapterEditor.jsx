import React, { useState, useRef } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import { cn } from "@/utils/cn"

const ChapterEditor = ({ 
  chapter, 
  onSave, 
  onPublish, 
  onCancel,
  autoSaveEnabled = true 
}) => {
  const [title, setTitle] = useState(chapter?.title || "")
  const [content, setContent] = useState(chapter?.content || "")
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const contentRef = useRef(null)
  const saveTimeoutRef = useRef(null)

  // Auto-save functionality
  React.useEffect(() => {
    if (autoSaveEnabled && (title || content)) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      
      saveTimeoutRef.current = setTimeout(async () => {
        if (title.trim() || content.trim()) {
          setIsSaving(true)
          try {
            await onSave?.({ title, content, published: false })
            setLastSaved(new Date())
          } catch (error) {
            console.error("Auto-save failed:", error)
          } finally {
            setIsSaving(false)
          }
        }
      }, 2000)
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [title, content, autoSaveEnabled, onSave])

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value)
    contentRef.current?.focus()
  }

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please add a title and content before publishing")
      return
    }

    try {
      await onPublish?.({ title, content, published: true })
    } catch (error) {
      console.error("Publish failed:", error)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await onSave?.({ title, content, published: false })
      setLastSaved(new Date())
    } catch (error) {
      console.error("Save failed:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const toolbarButtons = [
    { command: "bold", icon: "Bold", title: "Bold" },
    { command: "italic", icon: "Italic", title: "Italic" },
    { command: "underline", icon: "Underline", title: "Underline" },
    { separator: true },
    { command: "formatBlock", value: "h1", icon: "Heading1", title: "Heading 1" },
    { command: "formatBlock", value: "h2", icon: "Heading2", title: "Heading 2" },
    { command: "formatBlock", value: "h3", icon: "Heading3", title: "Heading 3" },
    { separator: true },
    { command: "justifyLeft", icon: "AlignLeft", title: "Align Left" },
    { command: "justifyCenter", icon: "AlignCenter", title: "Align Center" },
    { command: "justifyRight", icon: "AlignRight", title: "Align Right" }
  ]

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-primary">
            {chapter ? "Edit Chapter" : "New Chapter"}
          </h2>
          <div className="flex items-center gap-4 mt-2 text-sm text-secondary font-ui">
            {isSaving && (
              <span className="flex items-center gap-2">
                <ApperIcon name="Loader2" size={14} className="animate-spin" />
                Saving...
              </span>
            )}
            {lastSaved && !isSaving && (
              <span className="flex items-center gap-2">
                <ApperIcon name="Check" size={14} className="text-success" />
                Last saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={handleSave} disabled={isSaving}>
            Save Draft
          </Button>
          <Button 
            variant="primary" 
            onClick={handlePublish}
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Send" size={16} />
            Publish
          </Button>
        </div>
      </div>

      {/* Chapter Title */}
      <Input
        label="Chapter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter chapter title..."
        className="text-xl font-display"
      />

      {/* Editor */}
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="editor-toolbar flex items-center gap-1 p-3 bg-surface rounded-lg border border-surface/50">
          {toolbarButtons.map((button, index) => {
            if (button.separator) {
              return (
                <div key={index} className="w-px h-6 bg-secondary/20 mx-2" />
              )
            }
            
            return (
              <button
                key={button.command + (button.value || "")}
                onClick={() => formatText(button.command, button.value)}
                className="p-2 rounded-md text-secondary hover:bg-white hover:text-primary transition-colors"
                title={button.title}
                type="button"
              >
                <ApperIcon name={button.icon} size={16} />
              </button>
            )
          })}
        </div>

        {/* Content Editor */}
        <div className="relative">
          <div
            ref={contentRef}
            contentEditable
            className={cn(
              "min-h-[400px] p-6 bg-white border border-surface/50 rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
              "reading-content prose prose-lg max-w-none",
              "text-primary font-body leading-reading"
            )}
            style={{ 
              lineHeight: "1.8",
              fontSize: "16px" 
            }}
            onInput={(e) => setContent(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: content }}
            placeholder="Start writing your chapter..."
          />
          
          {!content && (
            <div className="absolute top-6 left-6 text-secondary/50 font-body pointer-events-none">
              Start writing your chapter...
            </div>
          )}
        </div>
      </div>

      {/* Word Count */}
      <div className="flex justify-between items-center text-sm text-secondary font-ui">
        <div>
          Word count: {content.replace(/<[^>]*>/g, "").split(/\s+/).filter(word => word.length > 0).length}
        </div>
        <div className="flex items-center gap-4">
          <span>Characters: {content.replace(/<[^>]*>/g, "").length}</span>
        </div>
      </div>
    </div>
  )
}

export default ChapterEditor