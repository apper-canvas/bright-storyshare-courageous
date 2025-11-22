import React, { useEffect } from 'react'

const PromptPassword = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK
    ApperUI.showPromptPassword('#authentication-prompt-password')
  }, [])
  
  return <div id="authentication-prompt-password"></div>
}

export default PromptPassword