import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { storyService } from "@/services/api/storyService";
import { toast } from "react-toastify";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";
const NewStory = () => {
  const navigate = useNavigate()
  const outletContext = useOutletContext()
  const { user } = useAuth()
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
        authorName: user?.name || "Your Name", // Use actual user name
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-primary mb-2">Create New Story</h1>
        <p className="text-secondary font-ui">Share your imagination with the world</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Story Details */}
          <div className="lg:col-span-2 space-y-6">
            <Input
              label="Story Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter your story title..."
              error={errors.title}
              required
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Tell readers what your story is about..."
              rows={4}
              error={errors.description}
              required
            />

            {/* Genre Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-ui font-medium text-primary">
                Genres <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {allGenres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => handleGenreToggle(genre)}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-ui font-medium transition-all",
                      formData.genres.includes(genre)
                        ? "bg-accent text-white"
                        : "bg-surface text-secondary hover:bg-accent/10 hover:text-accent"
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
              <div className="grid grid-cols-2 gap-2">
                {contentRatings.map((rating) => (
                  <button
                    key={rating.value}
                    type="button"
                    onClick={() => handleInputChange('contentRating', rating.value)}
                    className={cn(
                      "p-3 rounded-lg text-left transition-all border-2",
                      formData.contentRating === rating.value
                        ? "border-accent bg-accent/5"
                        : "border-surface hover:border-accent/50"
                    )}
                  >
                    <div className="font-ui font-medium text-primary">{rating.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Cover Image */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-ui font-medium text-primary">
                Cover Image
              </label>
              
              <div className="aspect-[3/4] border-2 border-dashed border-surface rounded-lg overflow-hidden bg-surface/30">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-secondary">
                    <div className="text-center">
                      <ApperIcon name="ImagePlus" size={48} className="mx-auto mb-2" />
                      <p className="font-ui text-sm">Upload cover image</p>
                    </div>
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-ui file:bg-surface file:text-primary hover:file:bg-accent hover:file:text-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-surface">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
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
      </form>
    </div>
  )
}

export default NewStory