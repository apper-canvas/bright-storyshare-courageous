import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import { formatNumber, formatRelativeDate } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const CommentItem = ({ comment, onReply, onLike, level = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(comment.likeCount)

  const handleLike = () => {
    const newLiked = !isLiked
    setIsLiked(newLiked)
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1)
    onLike?.(comment.Id, newLiked)
  }

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply?.(comment.Id, replyContent)
      setReplyContent("")
      setShowReplyForm(false)
    }
  }

  const maxLevel = 3

  return (
    <div className={cn("space-y-3", level > 0 && "comment-thread")}>
      <div className="flex gap-3">
        <Avatar name={comment.userName} size="sm" />
        
        <div className="flex-1 space-y-2">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-surface/50">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-ui font-semibold text-primary text-sm">
                {comment.userName}
              </span>
              <span className="text-xs text-secondary font-ui">
                {formatRelativeDate(comment.createdAt)}
              </span>
            </div>
            <p className="text-primary font-ui text-sm leading-relaxed">
              {comment.content}
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1 font-ui transition-colors",
                isLiked ? "text-red-500" : "text-secondary hover:text-red-500"
              )}
            >
              <ApperIcon 
                name="Heart" 
                size={12} 
                className={isLiked ? "fill-current" : ""} 
              />
              {likeCount > 0 && formatNumber(likeCount)}
            </button>
            
            {level < maxLevel && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-secondary hover:text-accent font-ui transition-colors"
              >
                Reply
              </button>
            )}
          </div>
          
          {showReplyForm && (
            <div className="space-y-3 pt-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                rows={3}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                >
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowReplyForm(false)
                    setReplyContent("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.Id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentItem