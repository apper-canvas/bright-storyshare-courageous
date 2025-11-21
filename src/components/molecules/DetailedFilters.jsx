import React, { useState } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const DetailedFilters = ({ 
  selectedStatus, 
  selectedLength, 
  selectedRating,
  onToggleStatus,
  onToggleLength,
  onToggleRating,
  onClear,
  totalCount = 0
}) => {
  const [expandedSection, setExpandedSection] = useState(null)

  const statusOptions = [
    { value: "Completed", label: "Completed", count: 0 },
    { value: "Ongoing", label: "Ongoing", count: 0 },
    { value: "On Hold", label: "On Hold", count: 0 }
  ]

  const lengthOptions = [
    { value: "short", label: "Short Stories", subtitle: "Under 5k words", count: 0 },
    { value: "medium", label: "Medium Length", subtitle: "5k - 20k words", count: 0 },
    { value: "long", label: "Long Stories", subtitle: "Over 20k words", count: 0 }
  ]

  const ratingOptions = [
    { value: "4+", label: "4+ Stars", count: 0 },
    { value: "3+", label: "3+ Stars", count: 0 },
    { value: "all", label: "All Ratings", count: 0 }
  ]

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const FilterSection = ({ title, options, selectedValues, onToggle, sectionKey }) => (
    <div className="border border-surface rounded-lg overflow-hidden">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full px-4 py-3 bg-surface/30 hover:bg-surface/50 flex items-center justify-between transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <span className="font-ui font-medium text-primary">{title}</span>
          {selectedValues.length > 0 && (
            <span className="bg-accent text-white text-xs font-ui font-bold rounded-full px-2 py-0.5 min-w-5 h-5 flex items-center justify-center">
              {selectedValues.length}
            </span>
          )}
        </div>
        <ApperIcon 
          name={expandedSection === sectionKey ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-secondary"
        />
      </button>
      
      {expandedSection === sectionKey && (
        <div className="p-4 space-y-2">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => onToggle(option.value)}
              className={cn(
                "w-full text-left px-3 py-2 text-sm font-ui rounded-md border transition-all duration-200",
                selectedValues.includes(option.value)
                  ? "bg-accent/10 text-accent border-accent/30 font-medium"
                  : "bg-white text-secondary border-surface hover:border-accent/30 hover:text-accent"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{option.label}</div>
                  {option.subtitle && (
                    <div className="text-xs text-secondary mt-0.5">{option.subtitle}</div>
                  )}
                </div>
                {selectedValues.includes(option.value) && (
                  <ApperIcon name="Check" size={16} className="text-accent" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-primary">Advanced Filters</h3>
        {totalCount > 0 && (
          <button
            onClick={onClear}
            className="text-sm text-secondary hover:text-accent font-ui flex items-center gap-1"
          >
            <ApperIcon name="X" size={14} />
            Clear ({totalCount})
          </button>
        )}
      </div>

      <div className="space-y-3">
        <FilterSection
          title="Story Status"
          options={statusOptions}
          selectedValues={selectedStatus}
          onToggle={onToggleStatus}
          sectionKey="status"
        />
        
        <FilterSection
          title="Story Length"
          options={lengthOptions}
          selectedValues={selectedLength}
          onToggle={onToggleLength}
          sectionKey="length"
        />
        
        <FilterSection
          title="Minimum Rating"
          options={ratingOptions}
          selectedValues={selectedRating}
          onToggle={onToggleRating}
          sectionKey="rating"
        />
      </div>

      {totalCount > 0 && (
        <div className="pt-2 text-center">
          <span className="text-xs font-ui text-secondary">
            {totalCount} detailed filter{totalCount !== 1 ? 's' : ''} active
          </span>
        </div>
      )}
    </div>
  )
}

export default DetailedFilters