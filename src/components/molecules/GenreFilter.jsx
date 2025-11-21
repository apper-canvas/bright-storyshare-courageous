import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const GenreFilter = ({ genres, selectedGenres, onToggleGenre, onClear }) => {
  const allGenres = [
    "Romance", "Fantasy", "Mystery", "Sci-Fi", 
    "Teen Fiction", "Thriller", "Historical", "Contemporary"
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-primary">Filter by Genre</h3>
        {selectedGenres.length > 0 && (
          <button
            onClick={onClear}
            className="text-sm text-secondary hover:text-accent font-ui flex items-center gap-1"
          >
            <ApperIcon name="X" size={14} />
            Clear ({selectedGenres.length})
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => onToggleGenre(genre)}
            className={cn(
              "px-3 py-1.5 text-sm font-ui rounded-full border transition-all duration-200",
              selectedGenres.includes(genre)
                ? "bg-accent text-white border-accent shadow-md"
                : "bg-surface text-secondary border-surface hover:border-accent hover:text-accent"
            )}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GenreFilter