import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class LibraryService {
  constructor() {
    this.tableName = 'library_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "lastReadChapterId_c"}},
          {"field": {"Name": "lastReadPosition_c"}},
          {"field": {"Name": "addedAt_c"}},
          {"field": {"Name": "userId_c"}},
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
      console.error("Error fetching library:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByStoryId(storyId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "lastReadChapterId_c"}},
          {"field": {"Name": "lastReadPosition_c"}},
          {"field": {"Name": "addedAt_c"}},
          {"field": {"Name": "userId_c"}},
          {"field": {"Name": "storyId_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "storyId_c",
          "Operator": "EqualTo",
          "Values": [parseInt(storyId)]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data?.[0] || null;
    } catch (error) {
      console.error("Error fetching library by story:", error?.response?.data?.message || error);
      return null;
    }
  }

  async getByStatus(status) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "lastReadChapterId_c"}},
          {"field": {"Name": "lastReadPosition_c"}},
          {"field": {"Name": "addedAt_c"}},
          {"field": {"Name": "userId_c"}},
          {"field": {"Name": "storyId_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": [status]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching library by status:", error?.response?.data?.message || error);
      return [];
    }
  }

  async addToLibrary(storyId, status = "want-to-read", userId = "user1") {
    try {
      // First check if entry exists and remove it
      await this.removeFromLibrary(storyId);

      const apperClient = getApperClient();
      const response = await apperClient.createRecord(this.tableName, {
        records: [{
          Name: `Library Entry - Story ${storyId}`,
          status_c: status,
          lastReadChapterId_c: null,
          lastReadPosition_c: 0,
          addedAt_c: new Date().toISOString(),
          userId_c: userId,
          storyId_c: parseInt(storyId)
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
          console.error(`Failed to create ${failed.length} library entries:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful[0]?.data || null;
      }

    } catch (error) {
      console.error("Error adding to library:", error?.response?.data?.message || error);
      return null;
    }
  }

  async removeFromLibrary(storyId) {
    try {
      // First find the library entry
      const entry = await this.getByStoryId(storyId);
      if (!entry) return true;

      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord(this.tableName, {
        RecordIds: [entry.Id]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error removing from library:", error?.response?.data?.message || error);
      return false;
    }
  }

  async updateStatus(storyId, status) {
    try {
      const entry = await this.getByStoryId(storyId);
      if (!entry) return null;

      const apperClient = getApperClient();
      const response = await apperClient.updateRecord(this.tableName, {
        records: [{
          Id: entry.Id,
          status_c: status
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
          console.error(`Failed to update ${failed.length} library entries:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful[0]?.data || null;
      }

    } catch (error) {
      console.error("Error updating library status:", error?.response?.data?.message || error);
      return null;
    }
  }

  async updateProgress(storyId, chapterId, position = 0) {
    try {
      const entry = await this.getByStoryId(storyId);
      if (!entry) return null;

      const apperClient = getApperClient();
      const response = await apperClient.updateRecord(this.tableName, {
        records: [{
          Id: entry.Id,
          lastReadChapterId_c: parseInt(chapterId),
          lastReadPosition_c: position
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
          console.error(`Failed to update ${failed.length} library entries:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful[0]?.data || null;
      }

    } catch (error) {
      console.error("Error updating library progress:", error?.response?.data?.message || error);
      return null;
    }
  }

  async getReadingListsForUser() {
    // Placeholder for future reading list integration
    return [];
  }

  async addReadingListToLibrary(readingListData) {
    // Placeholder for future reading list integration
    return readingListData;
  }
}

export const libraryService = new LibraryService();