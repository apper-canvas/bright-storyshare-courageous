/**
 * ApperClient Singleton Service
 * Provides a single instance of ApperClient for the entire application
 */

let _client = null;
let _isInitializing = false;

class ApperClientSingleton {
  constructor() {
    if (_client) {
      return _client;
    }
    _client = this;
  }

  async getInstance() {
    // Return existing instance if available
    if (this._apperClient) {
      return this._apperClient;
    }

    // Prevent multiple initializations
    if (_isInitializing) {
      // Wait for initialization to complete
      while (_isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      return this._apperClient;
    }

    _isInitializing = true;

    try {
      // Check if SDK is loaded
      if (!window.ApperSDK) {
        console.warn('ApperSDK not loaded');
        return null;
      }

      const { ApperClient } = window.ApperSDK;
      
      this._apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      return this._apperClient;
    } catch (error) {
      console.error('Failed to initialize ApperClient:', error);
      return null;
    } finally {
      _isInitializing = false;
    }
  }

  reset() {
    this._apperClient = null;
    _client = null;
    _isInitializing = false;
  }
}

// Export singleton instance getter
export const getApperClient = async () => {
  const singleton = new ApperClientSingleton();
  return await singleton.getInstance();
};

export default getApperClient;
/**
 * ApperClient Singleton Service
 * Provides a single instance of ApperClient for the entire application
 */

let _client = null;
let _isInitializing = false;

class ApperClientSingleton {
  constructor() {
    if (_client) {
      return _client;
    }
    _client = this;
  }

  async getInstance() {
    // Return existing instance if available
    if (this._apperClient) {
      return this._apperClient;
    }

    // Prevent multiple initializations
    if (_isInitializing) {
      // Wait for initialization to complete
      while (_isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      return this._apperClient;
    }

    _isInitializing = true;

    try {
      // Check if SDK is loaded
      if (!window.ApperSDK) {
        console.warn('ApperSDK not loaded');
        return null;
      }

      const { ApperClient } = window.ApperSDK;
      
      this._apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      return this._apperClient;
    } catch (error) {
      console.error('Failed to initialize ApperClient:', error);
      return null;
    } finally {
      _isInitializing = false;
    }
  }

  reset() {
    this._apperClient = null;
    _client = null;
    _isInitializing = false;
  }
}

// Export singleton instance getter
export const getApperClient = async () => {
  const singleton = new ApperClientSingleton();
  return await singleton.getInstance();
};

export default getApperClient;