import storyData from "@/services/mockData/stories.json";

// Service implementation using class pattern
class StoryService {
  constructor() {
    this.stories = [...storyData]
    this.delay = () => new Promise(resolve => setTimeout(resolve, 300))
  }

  async getAll() {
    await this.delay()
    return [...this.stories]
  }

  async getById(id) {
    await this.delay()
    const story = this.stories.find(s => s.Id === parseInt(id))
    if (!story) {
      throw new Error("Story not found")
    }
    return { ...story }
  }

  async create(storyData) {
    await this.delay()
    const newStory = {
      ...storyData,
      Id: Math.max(0, ...this.stories.map(s => s.Id)) + 1,
      viewCount: 0,
      likeCount: 0,
      chapterCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.stories.push(newStory)
    return { ...newStory }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.stories.findIndex(s => s.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Story not found")
    }
    
    this.stories[index] = {
      ...this.stories[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    return { ...this.stories[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.stories.findIndex(s => s.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Story not found")
    }
    
    this.stories.splice(index, 1)
    return true
  }

async search(query, filterOptions = {}) {
    await this.delay()
    
    let filtered = [...this.stories]
    
    // Text search filter
    if (query) {
      const searchTerm = query.toLowerCase()
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchTerm) ||
        story.authorName.toLowerCase().includes(searchTerm) ||
        story.description.toLowerCase().includes(searchTerm) ||
        story.genres.some(genre => genre.toLowerCase().includes(searchTerm))
      )
    }
    
    // Status filter
    if (filterOptions.status && filterOptions.status.length > 0) {
      filtered = filtered.filter(story => 
        filterOptions.status.includes(story.status)
      )
    }
    
    // Length filter
    if (filterOptions.length && filterOptions.length.length > 0) {
      filtered = filtered.filter(story => {
        const wordCount = story.wordCount || 0
        return filterOptions.length.some(range => {
          switch (range) {
            case 'short':
              return wordCount < 5000
            case 'medium':
              return wordCount >= 5000 && wordCount <= 20000
            case 'long':
              return wordCount > 20000
            default:
              return true
          }
        })
      })
    }
    
    // Rating filter
    if (filterOptions.rating && filterOptions.rating.length > 0) {
      filtered = filtered.filter(story => {
        const rating = story.rating || 0
        return filterOptions.rating.some(minRating => {
          switch (minRating) {
            case '4+':
              return rating >= 4.0
            case '3+':
              return rating >= 3.0
            case 'all':
            default:
              return true
          }
        })
      })
    }
    
    return filtered
  }

  async getByGenre(genre) {
    await this.delay()
    return this.stories.filter(story =>
      story.genres.includes(genre)
    )
  }

  async getFeatured() {
    await this.delay()
    return this.stories
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 6)
  }

  async getTrending() {
    await this.delay()
    return this.stories
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 8)
  }
}

export const storyService = new StoryService()