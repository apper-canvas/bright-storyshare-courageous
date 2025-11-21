import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class ChapterService {
  constructor() {
    this.tableName = 'chapters_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "orderIndex_c"}},
          {"field": {"Name": "published_c"}},
          {"field": {"Name": "publishedAt_c"}},
          {"field": {"Name": "viewCount_c"}},
          {"field": {"Name": "likeCount_c"}},
          {"field": {"Name": "commentCount_c"}},
          {"field": {"Name": "storyId_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching chapters:", error?.response?.data?.message || error);
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "orderIndex_c"}},
          {"field": {"Name": "published_c"}},
          {"field": {"Name": "publishedAt_c"}},
          {"field": {"Name": "viewCount_c"}},
          {"field": {"Name": "likeCount_c"}},
          {"field": {"Name": "commentCount_c"}},
          {"field": {"Name": "storyId_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching chapter ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async getByStoryId(storyId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "orderIndex_c"}},
          {"field": {"Name": "published_c"}},
          {"field": {"Name": "publishedAt_c"}},
          {"field": {"Name": "viewCount_c"}},
          {"field": {"Name": "likeCount_c"}},
          {"field": {"Name": "commentCount_c"}},
          {"field": {"Name": "storyId_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "storyId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(storyId)]
        }],
        orderBy: [{"fieldName": "orderIndex_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching chapters by story:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(chapterData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord(this.tableName, {
        records: [{
          Name: chapterData.title_c || chapterData.Name || 'New Chapter',
          title_c: chapterData.title_c,
          content_c: chapterData.content_c,
          orderIndex_c: chapterData.orderIndex_c || 1,
          published_c: chapterData.published_c || false,
          publishedAt_c: chapterData.published_c ? new Date().toISOString() : null,
          viewCount_c: 0,
          likeCount_c: 0,
          commentCount_c: 0,
          storyId_c: parseInt(chapterData.storyId_c)
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
          console.error(`Failed to create ${failed.length} chapters:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful[0]?.data || null;
      }

    } catch (error) {
      console.error("Error creating chapter:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      
      const updateRecord = { Id: parseInt(id) };
      
      if (updateData.title_c) updateRecord.title_c = updateData.title_c;
      if (updateData.content_c) updateRecord.content_c = updateData.content_c;
      if (updateData.orderIndex_c !== undefined) updateRecord.orderIndex_c = updateData.orderIndex_c;
      if (updateData.published_c !== undefined) {
        updateRecord.published_c = updateData.published_c;
        if (updateData.published_c) {
          updateRecord.publishedAt_c = new Date().toISOString();
        }
      }
      if (updateData.viewCount_c !== undefined) updateRecord.viewCount_c = updateData.viewCount_c;
      if (updateData.likeCount_c !== undefined) updateRecord.likeCount_c = updateData.likeCount_c;
      if (updateData.commentCount_c !== undefined) updateRecord.commentCount_c = updateData.commentCount_c;

      const response = await apperClient.updateRecord(this.tableName, {
        records: [updateRecord]
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
          console.error(`Failed to update ${failed.length} chapters:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful[0]?.data || null;
      }

    } catch (error) {
      console.error("Error updating chapter:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} chapters:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }

    } catch (error) {
      console.error("Error deleting chapter:", error?.response?.data?.message || error);
      return false;
    }
  }

  async incrementView(id) {
    try {
      const chapter = await this.getById(id);
      if (!chapter) return null;

      const newViewCount = (chapter.viewCount_c || 0) + 1;
      return await this.update(id, { viewCount_c: newViewCount });
    } catch (error) {
      console.error("Error incrementing view:", error?.response?.data?.message || error);
      return null;
    }
  }

  async toggleLike(id, liked) {
    try {
      const chapter = await this.getById(id);
      if (!chapter) return null;

      const newLikeCount = (chapter.likeCount_c || 0) + (liked ? 1 : -1);
      return await this.update(id, { likeCount_c: Math.max(0, newLikeCount) });
    } catch (error) {
      console.error("Error toggling like:", error?.response?.data?.message || error);
      return null;
    }
  }
}

export const chapterService = new ChapterService();