import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import ApperIcon from "@/components/ApperIcon"

function ReadingListForm({ list, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (list) {
      setFormData({
        name: list.name || "",
        description: list.description || ""
      })
    }
  }, [list])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      if (!list) {
        setFormData({ name: "", description: "" })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
          <ApperIcon name={list ? "Edit" : "Plus"} size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-display font-semibold text-primary">
            {list ? "Edit Reading List" : "Create New Reading List"}
          </h3>
          <p className="text-secondary font-ui text-sm">
            {list ? "Update your reading list details" : "Organize your stories into a custom collection"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-ui font-medium text-primary mb-2">
              List Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Fantasy Favorites, Mystery Collection, Quick Reads..."
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-ui font-medium text-primary mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe what kind of stories you'll collect in this list..."
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-secondary font-ui mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-surface">
          <Button
            type="submit"
            disabled={!formData.name.trim() || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
                {list ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <ApperIcon name={list ? "Save" : "Plus"} size={16} />
                {list ? "Update List" : "Create List"}
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ReadingListForm