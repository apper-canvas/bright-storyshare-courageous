import chapterData from "@/services/mockData/chapters.json";
import { notificationService } from "@/services/api/notificationService";
import { storyService } from "@/services/api/storyService";

// Service implementation using class pattern
class ChapterService {
  constructor() {
    this.chapters = [...chapterData]
    this.delay = () => new Promise(resolve => setTimeout(resolve, 250))
  }

  async getAll() {
    await this.delay()
    return [...this.chapters]
  }

  async getById(id) {
    await this.delay()
    const chapter = this.chapters.find(c => c.Id === parseInt(id))
    if (!chapter) {
      throw new Error("Chapter not found")
    }
    return { ...chapter }
  }

  async getByStoryId(storyId) {
    await this.delay()
    return this.chapters
      .filter(c => c.storyId === parseInt(storyId))
      .sort((a, b) => a.orderIndex - b.orderIndex)
  }

  async create(chapterData) {
    await this.delay()
    const newChapter = {
      ...chapterData,
      Id: Math.max(0, ...this.chapters.map(c => c.Id)) + 1,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      published: chapterData.published || false,
      publishedAt: chapterData.published ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.chapters.push(newChapter)
    return { ...newChapter }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.chapters.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Chapter not found")
    }
    
    const isPublishing = updateData.published && !this.chapters[index].published
    
    this.chapters[index] = {
      ...this.chapters[index],
      ...updateData,
      publishedAt: isPublishing ? new Date().toISOString() : this.chapters[index].publishedAt,
      updatedAt: new Date().toISOString()
    }
    return { ...this.chapters[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.chapters.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Chapter not found")
    }
    
    this.chapters.splice(index, 1)
    return true
  }

  async incrementView(id) {
    await this.delay()
    const chapter = this.chapters.find(c => c.Id === parseInt(id))
    if (chapter) {
      chapter.viewCount += 1
      chapter.updatedAt = new Date().toISOString()
    }
    return chapter
  }

  async toggleLike(id, liked) {
    await this.delay()
    const chapter = this.chapters.find(c => c.Id === parseInt(id))
    if (chapter) {
      chapter.likeCount += liked ? 1 : -1
      chapter.updatedAt = new Date().toISOString()
    }
    return chapter
  }
}

export const chapterService = new ChapterService()