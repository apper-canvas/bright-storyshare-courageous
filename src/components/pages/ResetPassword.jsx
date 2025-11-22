import React, { useEffect } from 'react'

const ResetPassword = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK
    ApperUI.showResetPassword('#authentication-reset-password')
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your new password below</p>
          </div>
          
          <div id="authentication-reset-password"></div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword