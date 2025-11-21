import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class AuthorFollowService {
  constructor() {
    this.tableName = 'authorFollows_c';
  }

  async follow(authorId, authorName, userId = "user1") {
    try {
      // Check if already following
      const isFollowing = await this.isFollowing(authorId);
      if (isFollowing) {
        return true;
      }

      const apperClient = getApperClient();
      const response = await apperClient.createRecord(this.tableName, {
        records: [{
          Name: `Follow ${authorName}`,
          authorId_c: authorId,
          authorName_c: authorName,
          followedAt_c: new Date().toISOString()
        }]
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
          console.error(`Failed to create ${failed.length} follows:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }

    } catch (error) {
      console.error("Error following author:", error?.response?.data?.message || error);
      return false;
    }
  }

  async unfollow(authorId) {
    try {
      // Find the follow record first
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [{"field": {"Name": "Id"}}],
        where: [{
          "FieldName": "authorId_c",
          "Operator": "EqualTo",
          "Values": [authorId]
        }]
      });

      if (!response.success || !response.data?.length) {
        return true; // Already not following
      }

      // Delete the follow record
      const deleteResponse = await apperClient.deleteRecord(this.tableName, {
        RecordIds: [response.data[0].Id]
      });

      if (!deleteResponse.success) {
        console.error(deleteResponse.message);
        toast.error(deleteResponse.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error unfollowing author:", error?.response?.data?.message || error);
      return false;
    }
  }

  async isFollowing(authorId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [{"field": {"Name": "Id"}}],
        where: [{
          "FieldName": "authorId_c",
          "Operator": "EqualTo",
          "Values": [authorId]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      return (response.data?.length || 0) > 0;
    } catch (error) {
      console.error("Error checking if following:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getFollowedAuthors() {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "authorId_c"}},
          {"field": {"Name": "authorName_c"}},
          {"field": {"Name": "followedAt_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "followedAt_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching followed authors:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getFollowerCount(authorId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [{"field": {"Name": "Id"}}],
        where: [{
          "FieldName": "authorId_c",
          "Operator": "EqualTo",
          "Values": [authorId]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        return 0;
      }

      return response.data?.length || 0;
    } catch (error) {
      console.error("Error fetching follower count:", error?.response?.data?.message || error);
      return 0;
    }
  }

  async getFollowersForAuthor(authorId) {
    try {
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords(this.tableName, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "authorId_c"}},
          {"field": {"Name": "authorName_c"}},
          {"field": {"Name": "followedAt_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "authorId_c",
          "Operator": "EqualTo",
          "Values": [authorId]
        }]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching followers for author:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export const authorFollowService = new AuthorFollowService();