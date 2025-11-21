import { toast } from "react-toastify";
import React from "react";
import { getApperClient } from "@/services/apperClient";
import { getApperClient } from "@/services/api/commentService";

class StoryService {
  constructor() {
    this.tableName = 'stories_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "genres_c"}},
          {"field": {"Name": "contentRating_c"}},
          {"field": {"Name": "coverImageUrl_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "viewCount_c"}},
          {"field": {"Name": "likeCount_c"}},
          {"field": {"Name": "chapterCount_c"}},
          {"field": {"Name": "authorId_c"}},
          {"field": {"Name": "authorName_c"}},
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
      console.error("Error fetching stories:", error?.response?.data?.message || error);
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
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "genres_c"}},
          {"field": {"Name": "contentRating_c"}},
          {"field": {"Name": "coverImageUrl_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "viewCount_c"}},
          {"field": {"Name": "likeCount_c"}},
          {"field": {"Name": "chapterCount_c"}},
          {"field": {"Name": "authorId_c"}},
          {"field": {"Name": "authorName_c"}},
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
      console.error(`Error fetching story ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(storyData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord(this.tableName, {
        records: [{
          Name: storyData.title_c || storyData.Name || 'New Story',
          title_c: storyData.title_c,
          description_c: storyData.description_c,
          genres_c: Array.isArray(storyData.genres_c) ? storyData.genres_c.join(',') : storyData.genres_c,
          contentRating_c: storyData.contentRating_c || 'general',
          coverImageUrl_c: storyData.coverImageUrl_c,
          status_c: storyData.status_c || 'ongoing',
          viewCount_c: 0,
          likeCount_c: 0,
          chapterCount_c: 0,
          authorId_c: storyData.authorId_c,
          authorName_c: storyData.authorName_c
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
          console.error(`Failed to create ${failed.length} stories:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful[0]?.data || null;
      }

    } catch (error) {
      console.error("Error creating story:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      
      const updateRecord = { Id: parseInt(id) };
      
      if (updateData.title_c) updateRecord.title_c = updateData.title_c;
      if (updateData.description_c) updateRecord.description_c = updateData.description_c;
      if (updateData.genres_c) {
        updateRecord.genres_c = Array.isArray(updateData.genres_c) ? updateData.genres_c.join(',') : updateData.genres_c;
      }
      if (updateData.contentRating_c) updateRecord.contentRating_c = updateData.contentRating_c;
      if (updateData.coverImageUrl_c) updateRecord.coverImageUrl_c = updateData.coverImageUrl_c;
      if (updateData.status_c) updateRecord.status_c = updateData.status_c;
      if (updateData.viewCount_c !== undefined) updateRecord.viewCount_c = updateData.viewCount_c;
      if (updateData.likeCount_c !== undefined) updateRecord.likeCount_c = updateData.likeCount_c;
      if (updateData.chapterCount_c !== undefined) updateRecord.chapterCount_c = updateData.chapterCount_c;

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
          console.error(`Failed to update ${failed.length} stories:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful[0]?.data || null;
      }

    } catch (error) {
      console.error("Error updating story:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} stories:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }

    } catch (error) {
      console.error("Error deleting story:", error?.response?.data?.message || error);
      return false;
    }
  }

  async search(query, filterOptions = {}) {
    try {
      const apperClient = getApperClient();
      
      const whereConditions = [];
      
      // Text search conditions
      if (query) {
        whereConditions.push({
          "FieldName": "title_c",
          "Operator": "Contains",
          "Values": [query]
        });
      }
      
      // Status filter
      if (filterOptions.status && filterOptions.status.length > 0) {
        whereConditions.push({
          "FieldName": "status_c", 
          "Operator": "ExactMatch",
          "Values": filterOptions.status
        });
      }

      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "genres_c"}},
          {"field": {"Name": "contentRating_c"}},
          {"field": {"Name": "coverImageUrl_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "viewCount_c"}},
          {"field": {"Name": "likeCount_c"}},
          {"field": {"Name": "chapterCount_c"}},
          {"field": {"Name": "authorId_c"}},
          {"field": {"Name": "authorName_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        ...(whereConditions.length > 0 && { where: whereConditions })
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching stories:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByGenre(genre) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "genres_c"}},
          {"field": {"Name": "contentRating_c"}},
          {"field": {"Name": "coverImageUrl_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "viewCount_c"}},
          {"field": {"Name": "likeCount_c"}},
          {"field": {"Name": "chapterCount_c"}},
          {"field": {"Name": "authorId_c"}},
          {"field": {"Name": "authorName_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "genres_c",
          "Operator": "Contains",
          "Values": [genre]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching stories by genre:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getFeatured() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "genres_c"}},
          {"field": {"Name": "contentRating_c"}},
          {"field": {"Name": "coverImageUrl_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "viewCount_c"}},
          {"field": {"Name": "likeCount_c"}},
          {"field": {"Name": "chapterCount_c"}},
          {"field": {"Name": "authorId_c"}},
          {"field": {"Name": "authorName_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "likeCount_c", "sorttype": "DESC"}],
        pagingInfo: { limit: 6, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching featured stories:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getTrending() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "genres_c"}},
          {"field": {"Name": "contentRating_c"}},
          {"field": {"Name": "coverImageUrl_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "viewCount_c"}},
          {"field": {"Name": "likeCount_c"}},
          {"field": {"Name": "chapterCount_c"}},
          {"field": {"Name": "authorId_c"}},
          {"field": {"Name": "authorName_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "viewCount_c", "sorttype": "DESC"}],
        pagingInfo: { limit: 8, offset: 0 }
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching trending stories:", error?.response?.data?.message || error);
      return [];
}
  }
}

export const storyService = new StoryService();