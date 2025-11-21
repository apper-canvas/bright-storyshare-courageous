import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Empty from "@/components/ui/Empty"
import { notificationService } from "@/services/api/notificationService"
import { formatRelativeDate } from "@/utils/formatters"
import { toast } from "react-toastify"
import { cn } from "@/utils/cn"

const NotificationCenter = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'unread', 'read'
  const [processingIds, setProcessingIds] = useState(new Set())

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await notificationService.getAll()
      setNotifications(data)
      setError(null)
    } catch (err) {
      console.error('Failed to load notifications:', err)
      setError('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    if (processingIds.has(notificationId)) return
    
    setProcessingIds(prev => new Set([...prev, notificationId]))
    
    try {
      await notificationService.markAsRead(notificationId)
      setNotifications(prev => prev.map(n => 
        n.Id === notificationId 
          ? { ...n, read: true, readAt: new Date().toISOString() }
          : n
      ))
      toast.success('Marked as read')
    } catch (error) {
      console.error('Failed to mark as read:', error)
      toast.error('Failed to mark as read')
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(notificationId)
        return newSet
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({
        ...n,
        read: true,
        readAt: new Date().toISOString()
      })))
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      toast.error('Failed to mark all as read')
    }
  }

  const handleDelete = async (notificationId) => {
    if (processingIds.has(notificationId)) return
    
    setProcessingIds(prev => new Set([...prev, notificationId]))
    
    try {
      await notificationService.delete(notificationId)
      setNotifications(prev => prev.filter(n => n.Id !== notificationId))
      toast.success('Notification deleted')
    } catch (error) {
      console.error('Failed to delete notification:', error)
      toast.error('Failed to delete notification')
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(notificationId)
        return newSet
      })
    }
  }

  const handleDeleteRead = async () => {
    try {
      await notificationService.deleteRead()
      setNotifications(prev => prev.filter(n => !n.read))
      toast.success('Read notifications deleted')
    } catch (error) {
      console.error('Failed to delete read notifications:', error)
      toast.error('Failed to delete read notifications')
    }
  }

  const handleNotificationClick = async (notification) => {
    // Mark as read if unread
    if (!notification.read) {
      await handleMarkAsRead(notification.Id)
    }

    // Navigate to the chapter or story
    if (notification.type === 'new_chapter' && notification.chapterId && notification.storyId) {
      navigate(`/story/${notification.storyId}/chapter/${notification.chapterId}`)
    } else if (notification.storyId) {
      navigate(`/story/${notification.storyId}`)
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'read') return n.read
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
            <p className="text-error font-ui">{error}</p>
            <Button onClick={loadNotifications} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-primary">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-secondary font-ui mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleMarkAllAsRead}
                >
                  <ApperIcon name="CheckCheck" size={16} className="mr-1" />
                  Mark All Read
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDeleteRead}
                className="text-error hover:bg-error hover:text-white"
              >
                <ApperIcon name="Trash2" size={16} className="mr-1" />
                Clear Read
              </Button>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-1 bg-surface rounded-lg p-1">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'read', label: 'Read', count: notifications.length - unreadCount }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  "flex-1 px-4 py-2 rounded-md font-ui font-medium text-sm transition-all duration-200",
                  filter === key
                    ? "bg-white text-primary shadow-sm"
                    : "text-secondary hover:text-primary"
                )}
              >
                {label} {count > 0 && <span className="text-xs opacity-75">({count})</span>}
              </button>
            ))}
          </div>
        )}

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Empty 
            title="No notifications"
            description={
              filter === 'unread' 
                ? "You're all caught up! No unread notifications."
                : filter === 'read'
                ? "No read notifications yet."
                : "You'll see notifications here when authors you follow publish new chapters."
            }
            icon="Bell"
          />
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card 
                key={notification.Id}
                hover
                className={cn(
                  "p-4 cursor-pointer transition-all duration-200",
                  !notification.read && "border-l-4 border-accent bg-accent/5"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={cn(
                      "p-2 rounded-full shrink-0 mt-1",
                      notification.type === 'new_chapter' 
                        ? "bg-blue-100 text-blue-600" 
                        : "bg-gray-100 text-gray-600"
                    )}>
                      <ApperIcon 
                        name={notification.type === 'new_chapter' ? 'BookOpen' : 'Bell'} 
                        size={16} 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-ui font-semibold text-primary text-sm">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <Badge variant="primary" size="sm" className="px-2 py-1 text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-secondary font-ui leading-relaxed mb-2">
                        {notification.message}
                      </p>
                      
                      <p className="text-xs text-secondary font-ui">
                        {formatRelativeDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkAsRead(notification.Id)
                        }}
                        disabled={processingIds.has(notification.Id)}
                        className="p-2 text-secondary hover:text-primary hover:bg-surface rounded-md transition-colors duration-200"
                        title="Mark as read"
                      >
                        <ApperIcon name="Check" size={14} />
                      </button>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(notification.Id)
                      }}
                      disabled={processingIds.has(notification.Id)}
                      className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-md transition-colors duration-200"
                      title="Delete notification"
                    >
                      <ApperIcon name="X" size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationCenter