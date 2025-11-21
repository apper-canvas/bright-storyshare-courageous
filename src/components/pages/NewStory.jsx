import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Textarea from "@/components/atoms/Textarea"
import { storyService } from "@/services/api/storyService"
import { cn } from "@/utils/cn"
import { toast } from "react-toastify"

const NewStory = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genres: [],
    contentRating: "general"
  })
  const [coverImage, setCoverImage] = useState(null)
  const [coverPreview, setCoverPreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const allGenres = [
    "Romance", "Fantasy", "Mystery", "Sci-Fi", 
    "Teen Fiction", "Thriller", "Historical", "Contemporary"
  ]

  const contentRatings = [
    { value: "general", label: "General Audiences" },
    { value: "teen", label: "Teen (13+)" },
    { value: "mature", label: "Mature (17+)" },
    { value: "explicit", label: "Explicit (18+)" }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleGenreToggle = (genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }))
  }

  const handleCoverUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onload = (e) => setCoverPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (formData.genres.length === 0) {
      newErrors.genres = "Please select at least one genre"
    }

    if (formData.genres.length > 3) {
      newErrors.genres = "Please select no more than 3 genres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      
      // Mock cover image URL - in a real app, this would upload to a service
      const coverImageUrl = coverPreview || `https://picsum.photos/400/600?random=${Date.now()}`
      
      const story = await storyService.create({
        ...formData,
        coverImageUrl,
        authorName: "Your Name", // Mock author
        status: "ongoing"
      })

      toast.success("Story created successfully!")
      navigate(`/story/${story.Id}`)
    } catch (err) {
      toast.error("Failed to create story")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/write")
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
            Create New Story
          </h1>
          <p className="text-lg text-secondary font-ui">
            Share your imagination with readers around the world
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cover Upload */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="font-display text-xl font-semibold text-primary">
                Story Cover
              </h3>
              
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-surface rounded-lg border-2 border-dashed border-surface/50 flex items-center justify-center overflow-hidden">
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                        <ApperIcon name="Image" size={24} className="text-accent" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-ui font-medium text-primary">
                          Upload Cover Image
                        </p>
                        <p className="text-sm text-secondary font-ui">
                          Recommended: 400x600px
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    id="cover-upload"
                  />
                  <label
                    htmlFor="cover-upload"
                    className="block w-full px-4 py-2 text-center font-ui font-medium text-secondary border border-surface rounded-lg hover:bg-surface hover:text-primary transition-colors cursor-pointer"
                  >
                    Choose Image
                  </label>
                  {coverPreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCoverPreview("")
                        setCoverImage(null)
                      }}
                      className="w-full"
                    >
                      Remove Image
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Story Details */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="font-display text-xl font-semibold text-primary">
                Story Details
              </h3>

              {/* Title */}
              <Input
                label="Story Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter your story title..."
                error={errors.title}
                className="text-xl font-display"
              />

              {/* Description */}
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your story. What is it about? What makes it compelling?"
                rows={6}
                error={errors.description}
              />

              {/* Genres */}
              <div className="space-y-3">
                <label className="block text-sm font-ui font-medium text-primary">
                  Genres (Select 1-3)
                </label>
                <div className="flex flex-wrap gap-2">
                  {allGenres.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => handleGenreToggle(genre)}
                      className={cn(
                        "px-3 py-1.5 text-sm font-ui rounded-full border transition-all duration-200",
                        formData.genres.includes(genre)
                          ? "bg-accent text-white border-accent shadow-md"
                          : "bg-surface text-secondary border-surface hover:border-accent hover:text-accent"
                      )}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
                {errors.genres && (
                  <p className="text-sm text-error font-ui">{errors.genres}</p>
                )}
              </div>

              {/* Content Rating */}
              <div className="space-y-3">
                <label className="block text-sm font-ui font-medium text-primary">
                  Content Rating
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {contentRatings.map((rating) => (
                    <label
                      key={rating.value}
                      className={cn(
                        "relative p-3 border rounded-lg cursor-pointer transition-all duration-200",
                        formData.contentRating === rating.value
                          ? "border-accent bg-accent/5"
                          : "border-surface hover:border-accent/50"
                      )}
                    >
                      <input
                        type="radio"
                        name="contentRating"
                        value={rating.value}
                        checked={formData.contentRating === rating.value}
                        onChange={(e) => handleInputChange("contentRating", e.target.value)}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="font-ui font-medium text-primary text-sm">
                          {rating.label}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-surface">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="inline-flex items-center gap-2"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              Cancel
            </Button>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="inline-flex items-center gap-2"
              >
                {loading ? (
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                ) : (
                  <ApperIcon name="Plus" size={16} />
                )}
                {loading ? "Creating..." : "Create Story"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewStory