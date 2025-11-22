class ApperClientSingleton {
  constructor() {
    this._client = null
    this._isInitializing = false
  }

  getInstance() {
    if (this._client) {
      return this._client
    }

    if (!window.ApperSDK) {
      return null
    }

    if (!this._isInitializing) {
      this._isInitializing = true
      const { ApperClient } = window.ApperSDK
      this._client = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
      this._isInitializing = false
    }

    return this._client
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