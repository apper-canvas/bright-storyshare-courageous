// Mock service for author following functionality
// In production, this would connect to a database with author_follows table

class AuthorFollowService {
  constructor() {
    this.STORAGE_KEY = 'author_follows'
    this.initializeStorage()
  }

  initializeStorage() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]))
    }
  }

  getFollows() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]')
    } catch (error) {
      console.error('Failed to parse follows from storage:', error)
      return []
    }
  }

  saveFollows(follows) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(follows))
    } catch (error) {
      console.error('Failed to save follows to storage:', error)
    }
  }

  async follow(authorId, authorName) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const follows = this.getFollows()
        const existingFollow = follows.find(f => f.authorId === authorId)
        
        if (!existingFollow) {
          const newFollow = {
            Id: Math.max(...follows.map(f => f.Id), 0) + 1,
            authorId,
            authorName,
            followedAt: new Date().toISOString()
          }
          follows.push(newFollow)
          this.saveFollows(follows)
        }
        
        resolve(true)
      }, 300) // Simulate API delay
    })
  }

  async unfollow(authorId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const follows = this.getFollows()
        const filteredFollows = follows.filter(f => f.authorId !== authorId)
        this.saveFollows(filteredFollows)
        resolve(true)
      }, 300) // Simulate API delay
    })
  }

  async isFollowing(authorId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const follows = this.getFollows()
        const isFollowing = follows.some(f => f.authorId === authorId)
        resolve(isFollowing)
      }, 100)
    })
  }

  async getFollowedAuthors() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const follows = this.getFollows()
        resolve([...follows])
      }, 200)
    })
  }

  async getFollowerCount(authorId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock follower count - in production this would be a proper count from database
        const follows = this.getFollows()
        const isFollowing = follows.some(f => f.authorId === authorId)
        // Return a mock count that changes based on follow status
        const baseCount = Math.floor(Math.random() * 100) + 10
        const count = isFollowing ? baseCount + 1 : baseCount
        resolve(count)
      }, 100)
    })
  }

  async getFollowersForAuthor(authorId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const follows = this.getFollows()
        const followers = follows.filter(f => f.authorId === authorId)
        resolve([...followers])
      }, 200)
    })
  }
}

export const authorFollowService = new AuthorFollowService()