import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { formatNumber, getGenreColor } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const StoryCard = ({ story, onLike, showDescription = false }) => {
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(story.likeCount)

  const handleLike = (e) => {
    e.stopPropagation()
    const newLiked = !isLiked
    setIsLiked(newLiked)
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1)
    onLike?.(story.Id, newLiked)
  }

  const handleClick = () => {
    navigate(`/story/${story.Id}`)
  }

  return (
    <Card hover onClick={handleClick} className="book-spine overflow-hidden">
      <div className="aspect-[3/4] overflow-hidden">
        <img
          src={story.coverImageUrl}
          alt={story.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-primary line-clamp-2 mb-1">
            {story.title}
          </h3>
          <p className="text-sm text-secondary font-ui">
            by {story.authorName}
          </p>
        </div>

        {showDescription && (
          <p className="text-sm text-secondary font-ui line-clamp-3 leading-relaxed">
            {story.description}
          </p>
        )}

        <div className="flex flex-wrap gap-1">
          {story.genres.slice(0, 2).map((genre) => (
            <Badge
              key={genre}
              variant="genre"
              size="sm"
              className={getGenreColor(genre)}
            >
              {genre}
            </Badge>
          ))}
          {story.genres.length > 2 && (
            <Badge variant="genre" size="sm">
              +{story.genres.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-surface">
          <div className="flex items-center gap-3 text-sm text-secondary font-ui">
            <span className="flex items-center gap-1">
              <ApperIcon name="FileText" size={14} />
              {story.chapterCount} chapters
            </span>
            <span className="flex items-center gap-1">
              <ApperIcon name="Eye" size={14} />
              {formatNumber(story.viewCount)}
            </span>
          </div>
          
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1 text-sm transition-colors duration-200 hover:scale-105",
              isLiked ? "text-red-500" : "text-secondary hover:text-red-500"
            )}
          >
            <ApperIcon 
              name="Heart" 
              size={14} 
              className={isLiked ? "fill-current heart-pulse" : ""} 
            />
            {formatNumber(likeCount)}
          </button>
        </div>
      </div>
    </Card>
  )
}

export default StoryCard