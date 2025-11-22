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
        await new Promise(resolve => setTimeout(resolve, 10))
      }
      return this._client
    }

    this._isInitializing = true

    try {
      if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded')
      }

      const { ApperClient } = window.ApperSDK
      this._client = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      return this._client
    } catch (error) {
      console.error('Failed to initialize ApperClient:', error)
      return null
    } finally {
      this._isInitializing = false
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

export default apperClientSingleton