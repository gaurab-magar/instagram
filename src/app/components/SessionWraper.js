'use client'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

const SessionWraper = ({children}) => {

  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}

export default SessionWraper