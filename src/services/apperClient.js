let ApperClientSingleton = null;

class ApperClientInstance {
  constructor() {
    if (ApperClientSingleton) {
      return ApperClientSingleton;
    }

    this._client = null;
    this._isInitializing = false;
    ApperClientSingleton = this;
  }

  async getInstance() {
    if (this._client) {
      return this._client;
    }

    if (this._isInitializing) {
      // Wait for initialization to complete
      while (this._isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      return this._client;
    }

    if (!window.ApperSDK) {
      console.warn('ApperSDK not loaded');
      return null;
    }

    this._isInitializing = true;

    try {
      const { ApperClient } = window.ApperSDK;
      this._client = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      return this._client;
    } finally {
      this._isInitializing = false;
    }
  }

  reset() {
    this._client = null;
    this._isInitializing = false;
  }
}

const apperClientInstance = new ApperClientInstance();

export const getApperClient = () => apperClientInstance.getInstance();
export const resetApperClient = () => apperClientInstance.reset();