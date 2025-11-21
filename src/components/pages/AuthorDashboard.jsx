import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import { storyService } from '@/services/api/storyService';
import { chapterService } from '@/services/api/chapterService';
import { formatNumber, formatDate, formatRelativeDate } from '@/utils/formatters';
import { toast } from 'react-toastify';

export default function AuthorDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    totalStories: 0,
    totalChapters: 0,
    totalViews: 0,
    totalLikes: 0,
    recentActivity: [],
    topStories: [],
    viewsChart: { series: [], categories: [] },
    engagementChart: { series: [], categories: [] }
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all stories and chapters
      const [stories, chapters] = await Promise.all([
        storyService.getAll(),
        chapterService.getAll()
      ]);

      // Filter for current author (mock: assume authorId 1 for demo)
      const currentAuthorId = 1;
      const myStories = stories.filter(story => story.authorId === currentAuthorId);
      const myChapters = chapters.filter(chapter => 
        myStories.some(story => story.Id === chapter.storyId)
      );

      // Calculate metrics
      const totalViews = myStories.reduce((sum, story) => sum + (story.views || 0), 0) +
                        myChapters.reduce((sum, chapter) => sum + (chapter.views || 0), 0);
      
      const totalLikes = myStories.reduce((sum, story) => sum + (story.likes || 0), 0) +
                        myChapters.reduce((sum, chapter) => sum + (chapter.likes || 0), 0);

      // Recent activity (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentActivity = [
        ...myStories
          .filter(story => new Date(story.publishedAt) > thirtyDaysAgo)
          .map(story => ({
            type: 'story',
            title: story.title,
            action: 'Published',
            date: story.publishedAt,
            views: story.views || 0,
            likes: story.likes || 0
          })),
        ...myChapters
          .filter(chapter => new Date(chapter.publishedAt || chapter.createdAt) > thirtyDaysAgo)
          .map(chapter => {
            const story = myStories.find(s => s.Id === chapter.storyId);
            return {
              type: 'chapter',
              title: chapter.title,
              storyTitle: story?.title || 'Unknown Story',
              action: 'Published',
              date: chapter.publishedAt || chapter.createdAt,
              views: chapter.views || 0,
              likes: chapter.likes || 0
            };
          })
      ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

      // Top performing stories
      const topStories = myStories
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)
        .map(story => ({
          ...story,
          chapterCount: myChapters.filter(ch => ch.storyId === story.Id).length
        }));

      // Generate chart data (mock time series)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });

      const viewsData = last7Days.map(() => Math.floor(Math.random() * 100) + 20);
      const likesData = last7Days.map(() => Math.floor(Math.random() * 30) + 5);

      setMetrics({
        totalStories: myStories.length,
        totalChapters: myChapters.length,
        totalViews,
        totalLikes,
        recentActivity,
        topStories,
        viewsChart: {
          series: [{ name: 'Views', data: viewsData }],
          categories: last7Days
        },
        engagementChart: {
          series: [
            { name: 'Views', data: viewsData },
            { name: 'Likes', data: likesData }
          ],
          categories: last7Days
        }
      });

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    chart: {
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#D4AF37', '#8B4513'],
    grid: {
      borderColor: '#F5E6D3',
      strokeDashArray: 3
    },
    xaxis: {
      labels: {
        style: { colors: '#2C1810', fontSize: '12px' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#2C1810', fontSize: '12px' }
      }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    dataLabels: { enabled: false },
    legend: {
      labels: { colors: '#2C1810' }
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView message={error} onRetry={loadDashboardData} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-primary">
              Author Dashboard
            </h1>
            <p className="text-secondary mt-1">
              Track your writing progress and story performance
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/write')} className="flex items-center gap-2">
              <ApperIcon name="PenTool" size={16} />
              Manage Stories
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/write/new')}
              className="flex items-center gap-2"
            >
              <ApperIcon name="Plus" size={16} />
              New Story
            </Button>
          </div>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center bg-white border border-surface shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mx-auto mb-3">
              <ApperIcon name="BookOpen" size={24} className="text-accent" />
            </div>
            <div className="text-2xl font-bold text-primary mb-1">
              {formatNumber(metrics.totalStories)}
            </div>
            <div className="text-sm text-secondary">Stories Published</div>
          </Card>

          <Card className="p-6 text-center bg-white border border-surface shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-info/10 rounded-full mx-auto mb-3">
              <ApperIcon name="FileText" size={24} className="text-info" />
            </div>
            <div className="text-2xl font-bold text-primary mb-1">
              {formatNumber(metrics.totalChapters)}
            </div>
            <div className="text-sm text-secondary">Chapters Written</div>
          </Card>

          <Card className="p-6 text-center bg-white border border-surface shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mx-auto mb-3">
              <ApperIcon name="Eye" size={24} className="text-success" />
            </div>
            <div className="text-2xl font-bold text-primary mb-1">
              {formatNumber(metrics.totalViews)}
            </div>
            <div className="text-sm text-secondary">Total Views</div>
          </Card>

          <Card className="p-6 text-center bg-white border border-surface shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-error/10 rounded-full mx-auto mb-3">
              <ApperIcon name="Heart" size={24} className="text-error" />
            </div>
            <div className="text-2xl font-bold text-primary mb-1">
              {formatNumber(metrics.totalLikes)}
            </div>
            <div className="text-sm text-secondary">Total Likes</div>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Views Chart */}
          <Card className="p-6 bg-white border border-surface shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-primary">Daily Views</h3>
              <Badge variant="outline" className="text-accent border-accent">
                Last 7 Days
              </Badge>
            </div>
            <div className="h-64">
              <Chart
                options={{
                  ...chartOptions,
                  colors: ['#D4AF37']
                }}
                series={metrics.viewsChart.series}
                type="area"
                height="100%"
              />
            </div>
          </Card>

          {/* Engagement Chart */}
          <Card className="p-6 bg-white border border-surface shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-primary">Engagement Overview</h3>
              <Badge variant="outline" className="text-secondary border-secondary">
                Views vs Likes
              </Badge>
            </div>
            <div className="h-64">
              <Chart
                options={chartOptions}
                series={metrics.engagementChart.series}
                type="line"
                height="100%"
              />
            </div>
          </Card>
        </div>

        {/* Content Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Top Performing Stories */}
          <Card className="xl:col-span-2 p-6 bg-white border border-surface shadow-card">
            <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
              <ApperIcon name="TrendingUp" size={20} />
              Top Performing Stories
            </h3>
            <div className="space-y-4">
              {metrics.topStories.map((story, index) => (
                <div 
                  key={story.Id} 
                  className="flex items-center justify-between p-4 bg-surface/50 rounded-lg hover:bg-surface/70 transition-colors cursor-pointer"
                  onClick={() => navigate(`/stories/${story.Id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-accent/20 rounded-full text-sm font-semibold text-accent">
                      #{index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-primary line-clamp-1">
                        {story.title}
                      </h4>
                      <p className="text-sm text-secondary">
                        {story.chapterCount} chapters • {story.genre}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-success">
                        <ApperIcon name="Eye" size={14} />
                        {formatNumber(story.views || 0)}
                      </span>
                      <span className="flex items-center gap-1 text-error">
                        <ApperIcon name="Heart" size={14} />
                        {formatNumber(story.likes || 0)}
                      </span>
                    </div>
                    <Badge 
                      variant={story.status === 'published' ? 'default' : 'secondary'}
                      size="sm"
                      className="mt-1"
                    >
                      {story.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {metrics.topStories.length === 0 && (
                <div className="text-center py-8 text-secondary">
                  <ApperIcon name="BookOpen" size={32} className="mx-auto mb-3 opacity-50" />
                  <p>No stories published yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate('/write/new')}
                    className="mt-2"
                  >
                    Create Your First Story
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 bg-white border border-surface shadow-card">
            <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
              <ApperIcon name="Activity" size={20} />
              Recent Activity
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {metrics.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-surface/30 rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-accent/20 rounded-full flex-shrink-0">
                    <ApperIcon 
                      name={activity.type === 'story' ? 'BookOpen' : 'FileText'} 
                      size={14} 
                      className="text-accent"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-primary">
                      <span className="font-medium">{activity.action}</span>{' '}
                      {activity.type === 'chapter' ? 'chapter' : 'story'}{' '}
                      <span className="font-medium">"{activity.title}"</span>
                      {activity.storyTitle && (
                        <span className="text-secondary"> in {activity.storyTitle}</span>
                      )}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-secondary">
                        {formatRelativeDate(activity.date)}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-secondary">
                        <span className="flex items-center gap-1">
                          <ApperIcon name="Eye" size={12} />
                          {activity.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <ApperIcon name="Heart" size={12} />
                          {activity.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {metrics.recentActivity.length === 0 && (
                <div className="text-center py-6 text-secondary">
                  <ApperIcon name="Activity" size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}