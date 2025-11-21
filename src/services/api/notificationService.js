import { authorFollowService } from "./authorFollowService";

// Mock service for notifications functionality
// Note: Since no notifications table exists in the database schema,
// we'll continue using localStorage for notifications

class NotificationService {
  constructor() {
    this.STORAGE_KEY = 'notifications'
    this.initializeStorage()
  }

  initializeStorage() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]))
    }
  }

  getNotifications() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]')
    } catch (error) {
      console.error('Failed to parse notifications from storage:', error)
      return []
    }
  }

  saveNotifications(notifications) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications))
    } catch (error) {
      console.error('Failed to save notifications to storage:', error)
    }
  }

  async createChapterNotification(authorId, chapterData) {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        try {
          // Check if user is following this author
          const isFollowing = await authorFollowService.isFollowing(authorId)
          
          if (isFollowing) {
            const notifications = this.getNotifications()
            const newNotification = {
              Id: Math.max(...notifications.map(n => n.Id), 0) + 1,
              type: 'new_chapter',
              title: 'New Chapter Published',
              message: `${chapterData.authorName_c} published a new chapter "${chapterData.title_c}" in "${chapterData.storyTitle_c}"`,
              authorId_c: authorId,
              authorName_c: chapterData.authorName_c,
              storyId_c: chapterData.storyId_c,
              storyTitle_c: chapterData.storyTitle_c,
              chapterId_c: chapterData.chapterId_c,
              chapterTitle_c: chapterData.title_c,
              read: false,
              createdAt: new Date().toISOString()
            }
            
            notifications.unshift(newNotification) // Add to beginning of array
            this.saveNotifications(notifications)
          }
          
          resolve(true)
        } catch (error) {
          console.error('Failed to create chapter notification:', error)
          resolve(false)
        }
      }, 100)
    })
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notifications = this.getNotifications()
        // Sort by creation date, newest first
        const sortedNotifications = notifications.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        )
        resolve([...sortedNotifications])
      }, 200)
    })
  }

  async getUnread() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notifications = this.getNotifications()
        const unreadNotifications = notifications.filter(n => !n.read)
        resolve([...unreadNotifications])
      }, 150)
    })
  }

  async getUnreadCount() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notifications = this.getNotifications()
        const unreadCount = notifications.filter(n => !n.read).length
        resolve(unreadCount)
      }, 100)
    })
  }

  async markAsRead(notificationId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notifications = this.getNotifications()
        const notification = notifications.find(n => n.Id === parseInt(notificationId))
        
        if (notification) {
          notification.read = true
          notification.readAt = new Date().toISOString()
          this.saveNotifications(notifications)
          resolve(true)
        } else {
          resolve(false)
        }
      }, 100)
    })
  }

  async markAllAsRead() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notifications = this.getNotifications()
        const updatedNotifications = notifications.map(n => ({
          ...n,
          read: true,
          readAt: new Date().toISOString()
        }))
        this.saveNotifications(updatedNotifications)
        resolve(true)
      }, 200)
    })
  }

  async delete(notificationId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notifications = this.getNotifications()
        const filteredNotifications = notifications.filter(n => n.Id !== parseInt(notificationId))
        this.saveNotifications(filteredNotifications)
        resolve(true)
      }, 100)
    })
  }

  async deleteAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.saveNotifications([])
        resolve(true)
      }, 200)
    })
  }

  async deleteRead() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notifications = this.getNotifications()
        const unreadNotifications = notifications.filter(n => !n.read)
        this.saveNotifications(unreadNotifications)
        resolve(true)
      }, 200)
    })
  }
}

export const notificationService = new NotificationService();