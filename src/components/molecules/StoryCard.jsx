import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { formatNumber, getGenreColor } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const StoryCard = ({ 
  story = {}, 
  onLike, 
  showDescription = false 
}) => {
  // Destructure with safe defaults to prevent undefined errors
  const {
    Id = 0,
    title = 'Untitled',
    authorName = 'Unknown Author',
    description = '',
    coverImageUrl = '',
    genres = [],
    chapterCount = 0,
    viewCount = 0,
likeCount = 0
  } = story;
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(false)
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount)
  const handleLike = (e) => {
    e.stopPropagation()
const newLiked = !isLiked
    setIsLiked(newLiked)
    setCurrentLikeCount(prev => newLiked ? prev + 1 : prev - 1)
    onLike?.(Id, newLiked)
  }

const handleClick = () => {
    navigate(`/story/${Id}`)
  }
  return (
    <Card hover onClick={handleClick} className="book-spine overflow-hidden">
<div className="aspect-[3/4] overflow-hidden">
        <img
          src={coverImageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-primary line-clamp-2 mb-1">
            {title}
          </h3>
          <p className="text-sm text-secondary font-ui">
            by {authorName}
          </p>
        </div>

        {showDescription && (
          <p className="text-sm text-secondary font-ui line-clamp-3 leading-relaxed">
            {description}
          </p>
        )}

<div className="flex flex-wrap gap-1">
          {genres.slice(0, 2).map((genre) => (
            <Badge
              key={genre}
              variant="genre"
              size="sm"
              className={getGenreColor(genre)}
            >
              {genre}
            </Badge>
          ))}
          {genres.length > 2 && (
            <Badge variant="genre" size="sm">
              +{genres.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-surface">
          <div className="flex items-center gap-3 text-sm text-secondary font-ui">
<span className="flex items-center gap-1">
              <ApperIcon name="FileText" size={14} />
              {chapterCount} chapters
            </span>
            <span className="flex items-center gap-1">
              <ApperIcon name="Eye" size={14} />
              {formatNumber(viewCount)}
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
            {formatNumber(currentLikeCount)}
          </button>
        </div>
      </div>
    </Card>
  )
}

export default StoryCard