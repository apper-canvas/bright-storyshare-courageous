import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Avatar from '@/components/atoms/Avatar'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'
import StoryCard from '@/components/molecules/StoryCard'
import { authorFollowService } from '@/services/api/authorFollowService'
import { storyService } from '@/services/api/storyService'
import { formatRelativeDate, formatNumber } from '@/utils/formatters'
import { toast } from 'react-toastify'

export default function Following() {
  const navigate = useNavigate()
  const [followedAuthors, setFollowedAuthors] = useState([])
  const [recentStories, setRecentStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [storiesLoading, setStoriesLoading] = useState(false)

  useEffect(() => {
    loadFollowedAuthors()
  }, [])

  const loadFollowedAuthors = async () => {
    try {
      setLoading(true)
      const follows = await authorFollowService.getFollowedAuthors()
      setFollowedAuthors(follows)
      
      if (follows.length > 0) {
        await loadRecentStories(follows)
      }
    } catch (error) {
      console.error('Failed to load followed authors:', error)
      toast.error('Failed to load followed authors')
    } finally {
      setLoading(false)
    }
  }

  const loadRecentStories = async (follows) => {
    try {
      setStoriesLoading(true)
      const allStories = await storyService.getAll()
      
      // Get stories from followed authors, sorted by creation date
      const authorIds = follows.map(f => f.authorId)
      const followedAuthorStories = allStories
        .filter(story => authorIds.includes(story.authorId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 12) // Show latest 12 stories
      
      setRecentStories(followedAuthorStories)
    } catch (error) {
      console.error('Failed to load recent stories:', error)
      toast.error('Failed to load recent stories')
    } finally {
      setStoriesLoading(false)
    }
  }

  const handleUnfollow = async (authorId, authorName) => {
    try {
      await authorFollowService.unfollow(authorId)
      setFollowedAuthors(prev => prev.filter(f => f.authorId !== authorId))
      
      // Remove stories from this author
      setRecentStories(prev => prev.filter(story => story.authorId !== authorId))
      
      toast.success(`Unfollowed ${authorName}`)
    } catch (error) {
      console.error('Failed to unfollow author:', error)
      toast.error('Failed to unfollow author')
    }
  }

  const handleStoryLike = async (storyId, liked) => {
    try {
      // Update the story in recent stories
      setRecentStories(prev => 
        prev.map(story => 
          story.Id === storyId 
            ? { ...story, isLiked: liked, likeCount: liked ? story.likeCount + 1 : story.likeCount - 1 }
            : story
        )
      )
    } catch (error) {
      console.error('Failed to update story like:', error)
    }
  }

  if (loading) {
    return <Loading />
  }

  if (followedAuthors.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-primary mb-2">Following</h1>
            <p className="text-secondary font-ui">Stay connected with your favorite authors</p>
          </div>
          
          <Empty 
            icon="Users"
            title="No Authors Followed Yet"
            description="Start following authors to see their latest stories and updates here. You can follow authors from their story pages or profiles."
            action={
              <Button onClick={() => navigate('/')}>
                <ApperIcon name="Compass" size={16} className="mr-1" />
                Discover Stories
              </Button>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-primary mb-2">Following</h1>
          <p className="text-secondary font-ui">
            You're following {formatNumber(followedAuthors.length)} {followedAuthors.length === 1 ? 'author' : 'authors'}
          </p>
        </div>

        {/* Followed Authors Section */}
        <div className="mb-12">
          <h2 className="text-xl font-display font-semibold text-primary mb-6">Authors You Follow</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {followedAuthors.map((follow) => (
              <Card key={follow.Id} className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar name={follow.authorName} size="large" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-ui font-semibold text-primary truncate">
                      {follow.authorName}
                    </h3>
                    <p className="text-sm text-secondary font-ui mb-3">
                      Followed {formatRelativeDate(follow.followedAt)}
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleUnfollow(follow.authorId, follow.authorName)}
                      className="w-full"
                    >
                      <ApperIcon name="UserMinus" size={14} className="mr-1" />
                      Unfollow
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Stories Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-primary">Recent Stories</h2>
            {recentStories.length > 0 && (
              <Badge variant="secondary">
                {formatNumber(recentStories.length)} stories
              </Badge>
            )}
          </div>

          {storiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-surface rounded-lg h-64"></div>
                </div>
              ))}
            </div>
          ) : recentStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentStories.map((story) => (
                <StoryCard
                  key={story.Id}
                  story={story}
                  onLike={handleStoryLike}
                  showDescription={false}
                />
              ))}
            </div>
          ) : (
            <Empty 
              icon="BookOpen"
              title="No Recent Stories"
              description="Your followed authors haven't published any stories yet. Check back later for new content!"
            />
          )}
        </div>

        {recentStories.length > 0 && (
          <div className="mt-8 text-center">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/')}
            >
              <ApperIcon name="Compass" size={16} className="mr-1" />
              Discover More Stories
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}