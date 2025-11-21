import chapterData from "@/services/mockData/chapters.json"
import { notificationService } from "@/services/api/notificationService"
import { storyService } from "@/services/api/storyService"

let chapters = [...chapterData]

export const chapterService = {
  getAll: () => {
    return Promise.resolve([...chapters])
  },

  getById: (id) => {
    const chapter = chapters.find(c => c.Id === parseInt(id))
    return Promise.resolve(chapter || null)
  },

  getByStoryId: (storyId) => {
    const storyChapters = chapters.filter(c => c.storyId === parseInt(storyId))
    return Promise.resolve([...storyChapters])
  },

  create: async (chapterData) => {
    const newChapter = {
      ...chapterData,
      Id: Math.max(...chapters.map(c => c.Id), 0) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    chapters.push(newChapter)

    // If chapter is published, create notification for followers
    if (newChapter.published) {
      const story = await storyService.getById(newChapter.storyId)
      if (story) {
        await notificationService.createChapterNotification(story.authorId, {
          storyId: story.Id,
          storyTitle: story.title,
          chapterId: newChapter.Id,
          chapterTitle: newChapter.title,
          authorName: story.authorName
        })
      }
    }

    return Promise.resolve({ ...newChapter })
  },

  update: async (id, updateData) => {
    const index = chapters.findIndex(c => c.Id === parseInt(id))
    if (index === -1) return Promise.resolve(null)

    const oldChapter = { ...chapters[index] }
    chapters[index] = {
      ...chapters[index],
      ...updateData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    }

    // If chapter was just published (wasn't published before, but is now)
    if (!oldChapter.published && chapters[index].published) {
      const story = await storyService.getById(chapters[index].storyId)
      if (story) {
        await notificationService.createChapterNotification(story.authorId, {
          storyId: story.Id,
          storyTitle: story.title,
          chapterId: chapters[index].Id,
          chapterTitle: chapters[index].title,
          authorName: story.authorName
        })
      }
    }

    return Promise.resolve({ ...chapters[index] })
  },

  delete: (id) => {
    const index = chapters.findIndex(c => c.Id === parseInt(id))
    if (index === -1) return Promise.resolve(false)

    chapters.splice(index, 1)
    return Promise.resolve(true)
  }
}

// Legacy default export for backward compatibility
const mockData = [...chapterData]
export default mockData

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