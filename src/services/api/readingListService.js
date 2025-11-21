import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class ReadingListService {
  constructor() {
    this.tableName = 'readingLists_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "userId_c"}},
          {"field": {"Name": "storyIds_c"}},
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
      console.error("Error fetching reading lists:", error?.response?.data?.message || error);
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
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "userId_c"}},
          {"field": {"Name": "storyIds_c"}},
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
      console.error(`Error fetching reading list ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(listData) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.createRecord(this.tableName, {
        records: [{
          Name: listData.Name || listData.name,
          description_c: listData.description_c || listData.description || "",
          userId_c: listData.userId_c || "user1",
          storyIds_c: 0 // Initialize with 0 as placeholder
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
          console.error(`Failed to create ${failed.length} reading lists:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful[0]?.data || null;
      }

    } catch (error) {
      console.error("Error creating reading list:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, updates) {
    try {
      const apperClient = getApperClient();
      
      const updateRecord = { Id: parseInt(id) };
      
      if (updates.Name || updates.name) updateRecord.Name = updates.Name || updates.name;
      if (updates.description_c !== undefined) updateRecord.description_c = updates.description_c;
      if (updates.storyIds_c !== undefined) updateRecord.storyIds_c = updates.storyIds_c;

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
          console.error(`Failed to update ${failed.length} reading lists:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful[0]?.data || null;
      }

    } catch (error) {
      console.error("Error updating reading list:", error?.response?.data?.message || error);
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
          console.error(`Failed to delete ${failed.length} reading lists:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }

    } catch (error) {
      console.error("Error deleting reading list:", error?.response?.data?.message || error);
      return false;
    }
  }

  async addStoryToList(listId, storyId) {
    try {
      // For simplicity, we'll use the storyId as the value
      // In production, you might want to maintain a separate junction table
      return await this.update(listId, { storyIds_c: parseInt(storyId) });
    } catch (error) {
      console.error("Error adding story to list:", error?.response?.data?.message || error);
      return null;
    }
  }

  async removeStoryFromList(listId, storyId) {
    try {
      // Reset to 0 when removing (simplified implementation)
      return await this.update(listId, { storyIds_c: 0 });
    } catch (error) {
      console.error("Error removing story from list:", error?.response?.data?.message || error);
      return null;
    }
  }

  async getListsContainingStory(storyId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "userId_c"}},
          {"field": {"Name": "storyIds_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "storyIds_c",
          "Operator": "EqualTo",
          "Values": [parseInt(storyId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching lists containing story:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getStoriesInList(listId, allStories = []) {
    try {
      const list = await this.getById(listId);
      if (!list || !list.storyIds_c) {
        return [];
      }

      // Find stories with the matching ID
      return allStories.filter(story => story.Id === list.storyIds_c);
    } catch (error) {
      console.error("Error fetching stories in list:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export const readingListService = new ReadingListService();