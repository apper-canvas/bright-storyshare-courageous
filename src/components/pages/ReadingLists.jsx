import React, { useState, useEffect } from "react"
import { useAuth } from "@/layouts/Root"
import { useNavigate } from "react-router-dom"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Empty from "@/components/ui/Empty"
import ErrorView from "@/components/ui/ErrorView"
import ReadingListForm from "@/components/molecules/ReadingListForm"
import ReadingListCard from "@/components/molecules/ReadingListCard"
import { readingListService } from "@/services/api/readingListService"
import { storyService } from "@/services/api/storyService"
import { toast } from "react-toastify"
import { cn } from "@/utils/cn"

function ReadingLists() {
  const navigate = useNavigate()
  const [readingLists, setReadingLists] = useState([])
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingList, setEditingList] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [readingListsData, storiesData] = await Promise.all([
        readingListService.getAll(),
        storyService.getAll()
      ])
      
      setReadingLists(readingListsData)
      setStories(storiesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateList = async (listData) => {
    try {
      const newList = await readingListService.create(listData)
      setReadingLists(prev => [...prev, newList])
      setShowCreateForm(false)
      toast.success("Reading list created successfully!")
    } catch (err) {
      toast.error("Failed to create reading list")
    }
  }

  const handleUpdateList = async (listId, updates) => {
    try {
      const updatedList = await readingListService.update(listId, updates)
      setReadingLists(prev => prev.map(list => 
        list.Id === listId ? updatedList : list
      ))
      setEditingList(null)
      toast.success("Reading list updated successfully!")
    } catch (err) {
      toast.error("Failed to update reading list")
    }
  }

  const handleDeleteList = async (listId) => {
    if (!confirm("Are you sure you want to delete this reading list? This action cannot be undone.")) {
      return
    }

    try {
      await readingListService.delete(listId)
      setReadingLists(prev => prev.filter(list => list.Id !== listId))
      toast.success("Reading list deleted successfully!")
    } catch (err) {
      toast.error("Failed to delete reading list")
    }
  }

  const handleRemoveStoryFromList = async (listId, storyId) => {
    try {
      await readingListService.removeStoryFromList(listId, storyId)
      // Refresh the specific list data
      const updatedList = await readingListService.getById(listId)
      setReadingLists(prev => prev.map(list => 
        list.Id === listId ? updatedList : list
      ))
      toast.success("Story removed from reading list!")
    } catch (err) {
      toast.error("Failed to remove story from list")
    }
  }

  const getStoriesForList = (list) => {
    return list.storyIds.map(storyId => 
      stories.find(story => story.Id === storyId)
    ).filter(Boolean)
  }

  if (loading) {
    return <Loading type="page" />
  }

  if (error) {
    return (
      <ErrorView 
        message={error}
        onRetry={loadData}
        fullPage
      />
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
          Reading Lists
        </h1>
        <p className="text-lg text-secondary font-ui">
          Create and manage your personalized story collections
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            Create New List
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/library')}
            className="inline-flex items-center gap-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            Back to Library
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-surface to-surface/80 rounded-lg p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
            <ApperIcon name="List" size={24} className="text-accent" />
          </div>
          <h3 className="font-display text-xl font-semibold text-primary mb-2">
            {readingLists.length}
          </h3>
          <p className="text-secondary font-ui text-sm">
            Reading Lists
          </p>
        </div>
        <div className="bg-gradient-to-br from-surface to-surface/80 rounded-lg p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
            <ApperIcon name="BookOpen" size={24} className="text-accent" />
          </div>
          <h3 className="font-display text-xl font-semibold text-primary mb-2">
            {readingLists.reduce((total, list) => total + list.storyIds.length, 0)}
          </h3>
          <p className="text-secondary font-ui text-sm">
            Total Stories
          </p>
        </div>
        <div className="bg-gradient-to-br from-surface to-surface/80 rounded-lg p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
            <ApperIcon name="Heart" size={24} className="text-accent" />
          </div>
          <h3 className="font-display text-xl font-semibold text-primary mb-2">
            {readingLists.length > 0 ? Math.round(readingLists.reduce((total, list) => total + list.storyIds.length, 0) / readingLists.length) : 0}
          </h3>
          <p className="text-secondary font-ui text-sm">
            Avg per List
          </p>
        </div>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingList) && (
        <Card className="p-6">
          <ReadingListForm
            list={editingList}
            onSubmit={editingList ? 
              (data) => handleUpdateList(editingList.Id, data) : 
              handleCreateList
            }
            onCancel={() => {
              setShowCreateForm(false)
              setEditingList(null)
            }}
          />
        </Card>
      )}

      {/* Reading Lists Grid */}
      <div className="space-y-6">
        {readingLists.length === 0 ? (
          <Empty 
            type="library"
            title="No reading lists yet"
            description="Create your first reading list to start organizing your favorite stories into custom collections."
            actionLabel="Create Your First List"
            onAction={() => setShowCreateForm(true)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {readingLists.map((list) => (
              <ReadingListCard
                key={list.Id}
                list={list}
                stories={getStoriesForList(list)}
                onEdit={() => setEditingList(list)}
                onDelete={() => handleDeleteList(list.Id)}
                onRemoveStory={(storyId) => handleRemoveStoryFromList(list.Id, storyId)}
                onViewStory={(storyId) => navigate(`/story/${storyId}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReadingLists