import React, { useEffect } from 'react'

const PromptPassword = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    if (ApperUI) {
      ApperUI.showPromptPassword('#authentication-prompt-password');
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div id="authentication-prompt-password"></div>
      </div>
    </div>
  )
}

export default PromptPassword