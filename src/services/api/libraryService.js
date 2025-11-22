import libraryData from "@/services/mockData/library.json"

class LibraryService {
  constructor() {
    this.library = [...libraryData]
    this.delay = () => new Promise(resolve => setTimeout(resolve, 200))
  }

  async getAll() {
    await this.delay()
    return [...this.library]
  }

  async getByStoryId(storyId) {
    await this.delay()
    return this.library.find(item => item.storyId === parseInt(storyId))
  }

  async getByStatus(status) {
    await this.delay()
    return this.library.filter(item => item.status === status)
  }

  async addToLibrary(storyId, status = "want-to-read") {
    await this.delay()
    
    // Remove existing entry if it exists
    this.library = this.library.filter(item => item.storyId !== parseInt(storyId))
    
    const newEntry = {
      userId: "user1", // Mock user ID
      storyId: parseInt(storyId),
      status,
      lastReadChapterId: null,
      lastReadPosition: 0,
      addedAt: new Date().toISOString()
    }
    
    this.library.push(newEntry)
    return { ...newEntry }
  }

  async removeFromLibrary(storyId) {
    await this.delay()
    this.library = this.library.filter(item => item.storyId !== parseInt(storyId))
    return true
  }

  async updateStatus(storyId, status) {
    await this.delay()
    const item = this.library.find(item => item.storyId === parseInt(storyId))
    if (item) {
      item.status = status
      return { ...item }
    }
    return null
  }

  async updateProgress(storyId, chapterId, position = 0) {
    await this.delay()
    const item = this.library.find(item => item.storyId === parseInt(storyId))
    if (item) {
      item.lastReadChapterId = parseInt(chapterId)
      item.lastReadPosition = position
      return { ...item }
    }
    return null
  }
}

export const libraryService = new LibraryService()