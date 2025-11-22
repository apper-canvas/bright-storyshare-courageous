import React, { useEffect } from 'react'

const PromptPassword = () => {
  useEffect(() => {
    if (window.ApperSDK?.ApperUI) {
      window.ApperSDK.ApperUI.showPromptPassword('#authentication-prompt-password')
    }
  }, [])
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-primary mb-4">Set Password</h1>
          <p className="text-secondary font-ui">Please set your password to continue</p>
        </div>
        
        <div id="authentication-prompt-password" className="bg-white rounded-xl shadow-card p-8 border border-surface">
          {/* ApperUI will render prompt password form here */}
        </div>
      </div>
    </div>
  )
}

export default PromptPassword