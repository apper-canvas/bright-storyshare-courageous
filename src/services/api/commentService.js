import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class CommentService {
  constructor() {
    this.tableName = 'comments_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "likeCount_c"}},
          {"field": {"Name": "userId_c"}},
          {"field": {"Name": "userName_c"}},
          {"field": {"Name": "chapterId_c"}},
          {"field": {"Name": "parentCommentId_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching comments:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "likeCount_c"}},
          {"field": {"Name": "userId_c"}},
          {"field": {"Name": "userName_c"}},
          {"field": {"Name": "chapterId_c"}},
          {"field": {"Name": "parentCommentId_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching comment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByChapter(chapterId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "likeCount_c"}},
          {"field": {"Name": "userId_c"}},
          {"field": {"Name": "userName_c"}},
          {"field": {"Name": "chapterId_c"}},
          {"field": {"Name": "parentCommentId_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "chapterId_c",
          "Operator": "EqualTo", 
          "Values": [parseInt(chapterId)]
        }],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      const comments = response.data || [];
      
      // Organize comments with replies
      const topLevelComments = comments.filter(c => !c.parentCommentId_c);
      const replies = comments.filter(c => c.parentCommentId_c);
      
      return topLevelComments.map(comment => ({
        ...comment,
        replies: replies
          .filter(r => r.parentCommentId_c === comment.Id)
          .sort((a, b) => new Date(a.CreatedOn) - new Date(b.CreatedOn))
      })).sort((a, b) => new Date(b.CreatedOn) - new Date(a.CreatedOn));

    } catch (error) {
      console.error("Error fetching chapter comments:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(commentData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord(this.tableName, {
        records: [{
          Name: commentData.Name || commentData.content_c?.substring(0, 50) || 'Comment',
          content_c: commentData.content_c,
          userId_c: commentData.userId_c,
          userName_c: commentData.userName_c,
          chapterId_c: parseInt(commentData.chapterId_c),
          parentCommentId_c: commentData.parentCommentId_c ? parseInt(commentData.parentCommentId_c) : null,
          likeCount_c: 0
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} comments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful[0]?.data || null;
      }

    } catch (error) {
      console.error("Error creating comment:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.updateRecord(this.tableName, {
        records: [{
          Id: parseInt(id),
          ...(updateData.content_c && { content_c: updateData.content_c }),
          ...(updateData.likeCount_c !== undefined && { likeCount_c: updateData.likeCount_c })
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} comments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful[0]?.data || null;
      }

    } catch (error) {
      console.error("Error updating comment:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord(this.tableName, {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} comments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }

    } catch (error) {
      console.error("Error deleting comment:", error?.response?.data?.message || error);
      return false;
    }
  }

  async toggleLike(id, liked) {
    try {
      // First get current like count
      const comment = await this.getById(id);
      if (!comment) return null;

      const newLikeCount = (comment.likeCount_c || 0) + (liked ? 1 : -1);
      
      return await this.update(id, { likeCount_c: Math.max(0, newLikeCount) });
    } catch (error) {
      console.error("Error toggling like:", error?.response?.data?.message || error);
      return null;
    }
  }
}

export const commentService = new CommentService();

export const commentService = new CommentService()