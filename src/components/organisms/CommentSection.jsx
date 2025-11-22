import React, { useEffect, useState } from "react";
import { commentService } from "@/services/api/commentService";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Textarea from "@/components/atoms/Textarea";
import Button from "@/components/atoms/Button";
import CommentItem from "@/components/molecules/CommentItem";
const CommentSection = ({ chapterId }) => {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newComment, setNewComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (chapterId) {
      loadComments()
    }
  }, [chapterId])

  const loadComments = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await commentService.getByChapter(chapterId)
      setComments(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    try {
      setSubmitting(true)
      const comment = await commentService.create({
        chapterId,
        content: newComment,
        userName: user?.name || "Reader" + Math.floor(Math.random() * 1000), // Use actual user name
        userId: user?.id || "user" + Math.floor(Math.random() * 1000)
      })
      
      setComments(prev => [comment, ...prev])
      setNewComment("")
    } catch (err) {
      console.error("Failed to submit comment:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = async (parentCommentId, content) => {
    try {
      const reply = await commentService.create({
        chapterId,
        content,
        parentCommentId,
        userName: user?.name || "Reader" + Math.floor(Math.random() * 1000), // Use actual user name
        userId: user?.id || "user" + Math.floor(Math.random() * 1000)
      })
      
      setComments(prev => prev.map(comment => {
        if (comment.Id === parentCommentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply]
          }
        }
        return comment
      }))
    } catch (err) {
      console.error("Failed to submit reply:", err)
    }
  }

  const handleLikeComment = async (commentId, liked) => {
    try {
      // Update UI optimistically
      setComments(prev => prev.map(comment => {
        if (comment.Id === commentId) {
          return {
            ...comment,
            likeCount: liked ? comment.likeCount + 1 : comment.likeCount - 1
          }
        }
        // Handle replies
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply => 
              reply.Id === commentId 
                ? { ...reply, likeCount: liked ? reply.likeCount + 1 : reply.likeCount - 1 }
                : reply
            )
          }
        }
        return comment
      }))
    } catch (err) {
      console.error("Failed to like comment:", err)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-display font-semibold text-primary">Comments</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded shimmer" style={{width: "30%"}}></div>
                <div className="h-16 bg-gray-200 rounded-lg shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadComments} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-display font-semibold text-primary">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <div className="space-y-4 p-6 bg-surface/30 rounded-lg">
        <h4 className="font-ui font-medium text-primary">Share your thoughts</h4>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="What did you think about this chapter?"
          rows={3}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || submitting}
            className="inline-flex items-center gap-2"
          >
            {submitting ? (
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <ApperIcon name="Send" size={16} />
            )}
            {submitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <Empty 
          type="comments" 
          onAction={() => document.querySelector('textarea')?.focus()}
        />
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.Id}
              comment={comment}
              onReply={handleReply}
              onLike={handleLikeComment}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentSection