/**
 * ApperClient Singleton - Ensures single SDK instance
 */
class ApperClientSingleton {
  constructor() {
    this._client = null
    this._isInitializing = false
  }

  getInstance() {
    if (this._client) {
      return this._client
    }

    if (this._isInitializing) {
      return null
    }

    this._isInitializing = true

    try {
      const { ApperClient } = window.ApperSDK || {}
      
      if (!ApperClient) {
        console.warn('ApperSDK not loaded')
        this._isInitializing = false
        return null
      }

      this._client = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      this._isInitializing = false
      return this._client
    } catch (error) {
      console.error('Failed to initialize ApperClient:', error)
      this._isInitializing = false
      return null
    }
  }

  reset() {
    this._client = null
    this._isInitializing = false
  }
}

const apperClientSingleton = new ApperClientSingleton()

export const getApperClient = () => {
  return apperClientSingleton.getInstance()
}

export const resetApperClient = () => {
  apperClientSingleton.reset()
}