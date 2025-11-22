import React, { useEffect } from 'react'

const PromptPassword = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK
    ApperUI.showPromptPassword('#authentication-prompt-password')
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-primary">
            Set Your Password
          </h2>
          <p className="mt-2 text-sm text-secondary font-ui">
            Please set a password for your account
          </p>
        </div>
        
        <div id="authentication-prompt-password" className="mt-8"></div>
      </div>
    </div>
  )
}

export default PromptPassword