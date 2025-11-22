import React, { useState } from "react"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { formatDate } from "@/utils/formatters"
import { cn } from "@/utils/cn"

function ReadingListCard({ list, stories, onEdit, onDelete, onRemoveStory, onViewStory }) {
  const [showStories, setShowStories] = useState(false)

  return (
    <Card className="p-6 space-y-4 hover:shadow-card-hover transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
              <ApperIcon name="List" size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-display font-semibold text-primary">
                {list.name}
              </h3>
              <p className="text-xs text-secondary font-ui">
                Created {formatDate(list.createdAt)}
              </p>
            </div>
          </div>
          {list.description && (
            <p className="text-secondary font-ui text-sm mb-3 line-clamp-2">
              {list.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            <ApperIcon name="Edit" size={14} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-error hover:text-error hover:bg-error/10"
          >
            <ApperIcon name="Trash2" size={14} />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 py-3 border-t border-b border-surface">
        <Badge variant="genre">
          {stories.length} {stories.length === 1 ? 'story' : 'stories'}
        </Badge>
        {list.updatedAt !== list.createdAt && (
          <span className="text-xs text-secondary font-ui">
            Updated {formatDate(list.updatedAt)}
          </span>
        )}
      </div>

      {/* Stories Preview */}
      {stories.length > 0 && (
        <div className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStories(!showStories)}
            className="w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <ApperIcon name="BookOpen" size={14} />
              {showStories ? 'Hide Stories' : 'Show Stories'}
            </span>
            <ApperIcon 
              name="ChevronDown" 
              size={14} 
              className={cn("transition-transform", showStories && "rotate-180")}
            />
          </Button>

          {showStories && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {stories.map((story) => (
                <div
                  key={story.Id}
                  className="flex items-center gap-3 p-3 bg-surface/30 rounded-lg hover:bg-surface/50 transition-colors"
                >
                  <img
                    src={story.coverImageUrl}
                    alt={story.title}
                    className="w-10 h-14 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-ui font-medium text-primary text-sm line-clamp-1">
                      {story.title}
                    </h4>
                    <p className="text-secondary font-ui text-xs">
                      by {story.author}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewStory(story.Id)}
                      className="p-1.5"
                    >
                      <ApperIcon name="Eye" size={12} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveStory(story.Id)}
                      className="p-1.5 text-error hover:text-error hover:bg-error/10"
                    >
                      <ApperIcon name="X" size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {stories.length === 0 && (
        <div className="text-center py-6 text-secondary font-ui text-sm">
          <ApperIcon name="BookOpen" size={24} className="mx-auto mb-2 opacity-50" />
          <p>No stories in this list yet</p>
          <p className="text-xs mt-1">Add stories from the story details page</p>
        </div>
      )}
    </Card>
  )
}

export default ReadingListCard