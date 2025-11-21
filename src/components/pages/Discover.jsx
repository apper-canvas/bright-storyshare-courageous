import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import StoryGrid from "@/components/organisms/StoryGrid";
import GenreFilter from "@/components/molecules/GenreFilter";
import Loading from "@/components/ui/Loading";
import { storyService } from "@/services/api/storyService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
const Discover = () => {
  const [searchParams] = useSearchParams()
  const [stories, setStories] = useState([])
  const [filteredStories, setFilteredStories] = useState([])
  const [featuredStories, setFeaturedStories] = useState([])
  const [trendingStories, setTrendingStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedGenres, setSelectedGenres] = useState([])
  const [activeTab, setActiveTab] = useState("all")

  const searchQuery = searchParams.get("search")

  useEffect(() => {
    loadStories()
  }, [])

  useEffect(() => {
    filterStories()
  }, [stories, selectedGenres, searchQuery, activeTab])

  const loadStories = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await storyService.getAll()
      setStories(data)
      
      // Set featured and trending stories
      setFeaturedStories(data.slice(0, 6))
      setTrendingStories(data.sort((a, b) => b.viewCount - a.viewCount).slice(0, 8))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterStories = () => {
    let filtered = [...stories]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(query) ||
        story.authorName.toLowerCase().includes(query) ||
        story.description.toLowerCase().includes(query) ||
        story.genres.some(genre => genre.toLowerCase().includes(query))
      )
    }

    // Apply genre filter
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(story =>
        story.genres.some(genre => selectedGenres.includes(genre))
      )
    }

    // Apply tab filter
    switch (activeTab) {
      case "featured":
        filtered = featuredStories.filter(story => 
          !searchQuery || 
          story.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        break
      case "trending":
        filtered = trendingStories.filter(story =>
          !searchQuery ||
          story.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        break
      default:
        // 'all' - no additional filtering needed
        break
    }

    setFilteredStories(filtered)
  }

  const handleToggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const handleClearGenres = () => {
    setSelectedGenres([])
  }

  const handleLikeStory = async (storyId, liked) => {
    try {
      // Update UI optimistically
      setStories(prev => prev.map(story =>
        story.Id === storyId
          ? { ...story, likeCount: liked ? story.likeCount + 1 : story.likeCount - 1 }
          : story
      ))
      toast.success(liked ? "Story liked!" : "Story unliked!")
    } catch (err) {
      toast.error("Failed to update like")
    }
  }

  const tabs = [
    { key: "all", label: "All Stories", count: stories.length },
    { key: "featured", label: "Featured", count: featuredStories.length },
    { key: "trending", label: "Trending", count: trendingStories.length }
  ]

  if (loading) {
    return <Loading type="page" />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      {!searchQuery && (
        <div className="text-center space-y-4 py-12 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary">
            Discover Amazing Stories
          </h1>
          <p className="text-lg text-secondary font-ui max-w-2xl mx-auto">
            Explore captivating fiction from talented writers around the world. 
            Find your next favorite story across multiple genres.
          </p>
        </div>
      )}

      {/* Search Results Header */}
      {searchQuery && (
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display font-bold text-primary">
            Search Results
          </h1>
          <p className="text-secondary font-ui">
            Found {filteredStories.length} stories for "{searchQuery}"
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <GenreFilter
            selectedGenres={selectedGenres}
            onToggleGenre={handleToggleGenre}
            onClear={handleClearGenres}
          />

          {/* Stats */}
          <div className="bg-surface/50 rounded-lg p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold text-primary">
              Community Stats
            </h3>
            <div className="space-y-3 text-sm font-ui">
              <div className="flex justify-between">
                <span className="text-secondary">Total Stories</span>
                <span className="text-primary font-semibold">{stories.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Active Genres</span>
                <span className="text-primary font-semibold">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Featured This Week</span>
                <span className="text-primary font-semibold">{featuredStories.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          {!searchQuery && (
            <div className="flex flex-wrap gap-2 border-b border-surface">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-4 py-2 font-ui font-medium border-b-2 transition-colors",
                    activeTab === tab.key
                      ? "border-accent text-accent"
                      : "border-transparent text-secondary hover:text-primary hover:border-surface"
                  )}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          )}

          {/* Stories Grid */}
          <StoryGrid
            stories={filteredStories}
            loading={false}
            error={error}
            onRetry={loadStories}
            onLike={handleLikeStory}
            emptyType="stories"
            showDescription={true}
          />
        </div>
      </div>
    </div>
  )
}

export default Discover