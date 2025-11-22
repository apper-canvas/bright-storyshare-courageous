import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { storyService } from "@/services/api/storyService";
import { toast } from "react-toastify";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { formatDate, formatNumber } from "@/utils/formatters";

const Write = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const { user } = useAuth();
const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMyStories();
  }, []);
const loadMyStories = async () => {
    try {
      setLoading(true);
      setError("");
      // Mock: Get all stories and filter by "current user"
      const allStories = await storyService.getAll();
      // In a real app, this would filter by actual user ID
      const myStories = allStories.slice(0, 3); // Mock user stories
      setStories(myStories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
};

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
      return;
    }
    try {
      await storyService.delete(storyId);
      setStories(prev => prev.filter(story => story.Id !== storyId));
      toast.success("Story deleted successfully");
    } catch (err) {
      toast.error("Failed to delete story");
    }
};

  const getStatusBadge = (story) => {
    if (story.status === "completed") {
      return <Badge variant="success" size="sm">Completed</Badge>;
    }
    if (story.chapterCount === 0) {
      return <Badge variant="warning" size="sm">Draft</Badge>;
    }
    return <Badge variant="primary" size="sm">Ongoing</Badge>;
  };
  if (loading) {
    return <Loading type="page" />
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadMyStories} fullPage />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">
            Your Stories
          </h1>
          <p className="text-lg text-secondary font-ui">
            Manage your stories and connect with readers
          </p>
        </div>
        
        <Button
          onClick={() => navigate("/write/new")}
          variant="primary"
          className="inline-flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={20} />
          New Story
        </Button>
      </div>

      {/* Writing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center">
            <ApperIcon name="BookOpen" size={24} className="text-accent" />
          </div>
          <h3 className="font-display text-2xl font-bold text-primary mb-1">
            {stories.length}
          </h3>
          <p className="text-secondary font-ui text-sm">Total Stories</p>
        </div>

        <div className="bg-gradient-to-br from-info/10 to-info/5 rounded-lg p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-info/20 rounded-full flex items-center justify-center">
            <ApperIcon name="FileText" size={24} className="text-info" />
          </div>
          <h3 className="font-display text-2xl font-bold text-primary mb-1">
            {stories.reduce((sum, story) => sum + story.chapterCount, 0)}
          </h3>
          <p className="text-secondary font-ui text-sm">Total Chapters</p>
        </div>

        <div className="bg-gradient-to-br from-success/10 to-success/5 rounded-lg p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-success/20 rounded-full flex items-center justify-center">
            <ApperIcon name="Eye" size={24} className="text-success" />
          </div>
          <h3 className="font-display text-2xl font-bold text-primary mb-1">
            {formatNumber(stories.reduce((sum, story) => sum + story.viewCount, 0))}
          </h3>
          <p className="text-secondary font-ui text-sm">Total Views</p>
        </div>

        <div className="bg-gradient-to-br from-error/10 to-error/5 rounded-lg p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-error/20 rounded-full flex items-center justify-center">
            <ApperIcon name="Heart" size={24} className="text-error" />
          </div>
          <h3 className="font-display text-2xl font-bold text-primary mb-1">
            {formatNumber(stories.reduce((sum, story) => sum + story.likeCount, 0))}
          </h3>
          <p className="text-secondary font-ui text-sm">Total Likes</p>
        </div>
      </div>

      {/* Stories List */}
      {stories.length === 0 ? (
        <Empty
          type="drafts"
          title="No stories yet"
          description="Start your writing journey by creating your first story. Share your imagination with readers around the world."
          actionLabel="Create Your First Story"
          onAction={() => navigate("/write/new")}
        />
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-semibold text-primary">
            Your Published Stories
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stories.map((story) => (
              <Card key={story.Id} className="p-6 hover:shadow-card-hover transition-all">
                <div className="flex gap-4">
                  <img
                    src={story.coverImageUrl}
                    alt={story.title}
                    className="w-20 h-28 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display text-xl font-semibold text-primary line-clamp-1">
                          {story.title}
                        </h3>
                        {getStatusBadge(story)}
                      </div>
                      <p className="text-secondary font-ui text-sm line-clamp-2 leading-relaxed">
                        {story.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {story.genres.slice(0, 2).map((genre) => (
                        <Badge key={genre} variant="genre" size="sm">
                          {genre}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-secondary font-ui">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="FileText" size={14} />
                        {story.chapterCount} chapters
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Eye" size={14} />
                        {formatNumber(story.viewCount)} views
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Heart" size={14} />
                        {formatNumber(story.likeCount)} likes
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Calendar" size={14} />
                        {formatDate(story.updatedAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-surface">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate(`/story/${story.Id}/edit`)}
                        className="inline-flex items-center gap-1"
                      >
                        <ApperIcon name="Edit2" size={14} />
                        Manage
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/story/${story.Id}`)}
                        className="inline-flex items-center gap-1"
                      >
                        <ApperIcon name="Eye" size={14} />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteStory(story.Id)}
                        className="inline-flex items-center gap-1"
                      >
                        <ApperIcon name="Trash2" size={14} />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-surface/50 to-surface/30 rounded-lg p-8">
        <h3 className="text-xl font-display font-semibold text-primary mb-6">
          Writer Resources
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
              <ApperIcon name="PenTool" size={24} className="text-accent" />
            </div>
            <h4 className="font-display font-semibold text-primary">
              Writing Tips
            </h4>
            <p className="text-secondary font-ui text-sm">
              Improve your craft with writing guides and techniques
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-info/10 rounded-full flex items-center justify-center">
              <ApperIcon name="Users" size={24} className="text-info" />
            </div>
            <h4 className="font-display font-semibold text-primary">
              Community
            </h4>
            <p className="text-secondary font-ui text-sm">
              Connect with other writers and share experiences
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-success" />
            </div>
            <h4 className="font-display font-semibold text-primary">
              Analytics
            </h4>
            <p className="text-secondary font-ui text-sm">
              Track your story performance and reader engagement
            </p>
          </div>
        </div>
      </div>
    </div>
);
};

export default Write;