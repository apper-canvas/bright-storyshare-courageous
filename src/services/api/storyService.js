import storyData from "@/services/mockData/stories.json"

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

  async search(query) {
    await this.delay()
    const searchTerm = query.toLowerCase()
    return this.stories.filter(story =>
      story.title.toLowerCase().includes(searchTerm) ||
      story.authorName.toLowerCase().includes(searchTerm) ||
      story.description.toLowerCase().includes(searchTerm) ||
      story.genres.some(genre => genre.toLowerCase().includes(searchTerm))
    )
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