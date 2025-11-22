/**
 * ApperClient Singleton - Prevents multiple SDK instances
 */
class ApperClientSingleton {
  constructor() {
    this._client = null
    this._isInitializing = false
  }

  async getInstance() {
    if (this._client) {
      return this._client
    }

    if (this._isInitializing) {
      // Wait for initialization to complete
      while (this._isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      return this._client
    }

    this._isInitializing = true

    try {
      const { ApperClient } = window.ApperSDK
      this._client = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
    } finally {
      this._isInitializing = false
    }

    return this._client
  }

  reset() {
    this._client = null
    this._isInitializing = false
  }
}

const singleton = new ApperClientSingleton()

export const getApperClient = () => {
  if (!window.ApperSDK) {
    console.warn('ApperSDK not loaded yet')
    return null
  }
  return singleton.getInstance()
}

export default singleton