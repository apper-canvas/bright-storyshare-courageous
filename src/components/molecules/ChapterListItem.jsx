import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { formatDate, formatNumber } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const ChapterListItem = ({ chapter, storyId, canEdit = false, onEdit, onDelete }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (chapter.published) {
      navigate(`/story/${storyId}/chapter/${chapter.Id}`)
    }
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit?.(chapter)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete?.(chapter)
  }

  return (
    <div
      className={cn(
        "p-4 border border-surface rounded-lg transition-all duration-200",
        chapter.published 
          ? "bg-white hover:shadow-card hover:border-accent/30 cursor-pointer"
          : "bg-surface/50 border-dashed"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-display text-lg text-primary font-semibold truncate">
              Chapter {chapter.orderIndex}: {chapter.title}
            </h4>
            <Badge
              variant={chapter.published ? "success" : "warning"}
              size="sm"
            >
              {chapter.published ? "Published" : "Draft"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-secondary font-ui">
            {chapter.published && (
              <>
                <span className="flex items-center gap-1">
                  <ApperIcon name="Eye" size={14} />
                  {formatNumber(chapter.viewCount)} views
                </span>
                <span className="flex items-center gap-1">
                  <ApperIcon name="Heart" size={14} />
                  {formatNumber(chapter.likeCount)} likes
                </span>
                <span className="flex items-center gap-1">
                  <ApperIcon name="MessageCircle" size={14} />
                  {formatNumber(chapter.commentCount)} comments
                </span>
              </>
            )}
            <span className="flex items-center gap-1">
              <ApperIcon name="Calendar" size={14} />
              {chapter.published ? 
                formatDate(chapter.publishedAt) : 
                `Created ${formatDate(chapter.createdAt)}`
              }
            </span>
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleEdit}
              className="p-2 text-secondary hover:text-accent hover:bg-surface rounded-md transition-colors"
              title="Edit chapter"
            >
              <ApperIcon name="Edit2" size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-md transition-colors"
              title="Delete chapter"
            >
              <ApperIcon name="Trash2" size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChapterListItem