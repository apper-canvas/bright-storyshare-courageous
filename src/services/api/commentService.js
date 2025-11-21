import commentData from "@/services/mockData/comments.json"

class CommentService {
  constructor() {
    this.comments = [...commentData]
    this.delay = () => new Promise(resolve => setTimeout(resolve, 200))
  }

  async getAll() {
    await this.delay()
    return [...this.comments]
  }

  async getById(id) {
    await this.delay()
    const comment = this.comments.find(c => c.Id === parseInt(id))
    if (!comment) {
      throw new Error("Comment not found")
    }
    return { ...comment }
  }

  async getByChapter(chapterId) {
    await this.delay()
    const chapterComments = this.comments.filter(c => c.chapterId === parseInt(chapterId))
    
    // Organize comments with replies
    const topLevelComments = chapterComments.filter(c => !c.parentCommentId)
    const replies = chapterComments.filter(c => c.parentCommentId)
    
    return topLevelComments.map(comment => ({
      ...comment,
      replies: replies
        .filter(r => r.parentCommentId === comment.Id)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  async create(commentData) {
    await this.delay()
    const newComment = {
      ...commentData,
      Id: Math.max(0, ...this.comments.map(c => c.Id)) + 1,
      likeCount: 0,
      createdAt: new Date().toISOString()
    }
    this.comments.push(newComment)
    return { ...newComment }
  }

  async update(id, updateData) {
    await this.delay()
    const index = this.comments.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Comment not found")
    }
    
    this.comments[index] = {
      ...this.comments[index],
      ...updateData
    }
    return { ...this.comments[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.comments.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Comment not found")
    }
    
    // Also delete any replies
    this.comments = this.comments.filter(c => 
      c.Id !== parseInt(id) && c.parentCommentId !== parseInt(id)
    )
    return true
  }

  async toggleLike(id, liked) {
    await this.delay()
    const comment = this.comments.find(c => c.Id === parseInt(id))
    if (comment) {
      comment.likeCount += liked ? 1 : -1
    }
    return comment
  }
}

export const commentService = new CommentService()