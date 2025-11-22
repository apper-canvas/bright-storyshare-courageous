import React, { useEffect } from 'react'

const PromptPassword = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK
    ApperUI.showPromptPassword('#authentication-prompt-password')
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Set Password</h1>
            <p className="text-gray-600">Please set your password to continue</p>
          </div>
          
          <div id="authentication-prompt-password"></div>
        </div>
      </div>
    </div>
  )
}

export default PromptPassword