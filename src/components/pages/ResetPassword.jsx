import React, { useEffect } from 'react'

const ResetPassword = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK
    ApperUI.showResetPassword('#authentication-reset-password')
  }, [])
  
  return <div id="authentication-reset-password"></div>
}

export default ResetPassword