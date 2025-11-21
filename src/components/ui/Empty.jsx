import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  type = "stories", 
  title, 
  description, 
  actionLabel, 
  onAction,
  icon = "BookOpen"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "stories":
        return {
          title: "No stories found",
          description: "Start exploring amazing stories from talented writers, or create your first story to share with the community.",
          actionLabel: "Explore Stories",
          icon: "BookOpen"
        }
      case "library":
        return {
          title: "Your library is empty",
          description: "Discover captivating stories and add them to your library to start building your personal collection.",
          actionLabel: "Browse Stories", 
          icon: "Library"
        }
      case "chapters":
        return {
          title: "No chapters yet",
          description: "This story is just getting started. Check back soon for new chapters, or write your first chapter if this is your story.",
          actionLabel: "Write First Chapter",
          icon: "FileText"
        }
      case "comments":
        return {
          title: "No comments yet",
          description: "Be the first to share your thoughts about this chapter. Your feedback helps writers improve and grow.",
          actionLabel: "Leave a Comment",
          icon: "MessageCircle"
        }
      case "drafts":
        return {
          title: "No drafts",
          description: "Start writing your next masterpiece. Your ideas deserve to become stories that readers will love.",
          actionLabel: "Write New Chapter",
          icon: "PenTool"
        }
      default:
        return {
          title: title || "Nothing here yet",
          description: description || "Get started by taking action.",
          actionLabel: actionLabel || "Get Started",
          icon: icon
        }
    }
  }

  const content = getEmptyContent()

  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-sm mx-auto space-y-6">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center">
          <ApperIcon name={content.icon} size={32} className="text-accent" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-display text-primary">{content.title}</h3>
          <p className="text-secondary font-ui leading-relaxed">
            {content.description}
          </p>
        </div>

        {onAction && (
          <Button 
            onClick={onAction}
            variant="primary" 
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            {content.actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Empty