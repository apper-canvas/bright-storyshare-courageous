/**
 * ApperClient Singleton
 * Prevents multiple SDK instances and provides centralized client access
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

    if (!window.ApperSDK) {
      console.warn('ApperSDK not loaded')
      return null
    }

    try {
      this._isInitializing = true
      const { ApperClient } = window.ApperSDK
      
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

// Main API function
export const getApperClient = () => {
  return apperClientSingleton.getInstance()
}

export default getApperClient