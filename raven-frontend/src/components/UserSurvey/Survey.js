import React from 'react'
import UserInfoSurvey from './UserInfoSurvey'

function Survey() {
  return (
    <div>
      <div className='text-center'>
        <h3>4 quick questions</h3>
        <p>to help us personalize your experience</p>
      </div>
      <UserInfoSurvey />
    </div>
  )
}

export default Survey