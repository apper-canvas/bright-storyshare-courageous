import readingListData from "@/services/mockData/readingLists.json"

class ReadingListService {
  constructor() {
    this.readingLists = [...readingListData]
    this.delay = () => new Promise(resolve => setTimeout(resolve, 200))
  }

  async getAll() {
    await this.delay()
    return [...this.readingLists]
  }

  async getById(id) {
    await this.delay()
    return this.readingLists.find(list => list.Id === parseInt(id))
  }

  async create(listData) {
    await this.delay()
    
    const newList = {
      Id: Math.max(...this.readingLists.map(l => l.Id), 0) + 1,
      name: listData.name,
      description: listData.description || "",
      storyIds: [],
      userId: "user1", // Mock user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.readingLists.push(newList)
    return { ...newList }
  }

  async update(id, updates) {
    await this.delay()
    const listIndex = this.readingLists.findIndex(list => list.Id === parseInt(id))
    if (listIndex === -1) {
      throw new Error("Reading list not found")
    }
    
    this.readingLists[listIndex] = {
      ...this.readingLists[listIndex],
      ...updates,
      Id: parseInt(id), // Preserve ID
      updatedAt: new Date().toISOString()
    }
    
    return { ...this.readingLists[listIndex] }
  }

  async delete(id) {
    await this.delay()
    const initialLength = this.readingLists.length
    this.readingLists = this.readingLists.filter(list => list.Id !== parseInt(id))
    
    if (this.readingLists.length === initialLength) {
      throw new Error("Reading list not found")
    }
    
    return true
  }

  async addStoryToList(listId, storyId) {
    await this.delay()
    const list = this.readingLists.find(l => l.Id === parseInt(listId))
    if (!list) {
      throw new Error("Reading list not found")
    }
    
    const storyIdInt = parseInt(storyId)
    if (!list.storyIds.includes(storyIdInt)) {
      list.storyIds.push(storyIdInt)
      list.updatedAt = new Date().toISOString()
    }
    
    return { ...list }
  }

  async removeStoryFromList(listId, storyId) {
    await this.delay()
    const list = this.readingLists.find(l => l.Id === parseInt(listId))
    if (!list) {
      throw new Error("Reading list not found")
    }
    
    list.storyIds = list.storyIds.filter(id => id !== parseInt(storyId))
    list.updatedAt = new Date().toISOString()
    
    return { ...list }
  }

  async getListsContainingStory(storyId) {
    await this.delay()
    return this.readingLists.filter(list => 
      list.storyIds.includes(parseInt(storyId))
    )
  }

  async getStoriesInList(listId, allStories = []) {
    await this.delay()
    const list = this.readingLists.find(l => l.Id === parseInt(listId))
    if (!list) {
      return []
    }
    
    return list.storyIds.map(storyId => 
      allStories.find(story => story.Id === storyId)
    ).filter(Boolean)
  }
}

export const readingListService = new ReadingListService()