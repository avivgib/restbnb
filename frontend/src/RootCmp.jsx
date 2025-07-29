import React from 'react'
import { Routes, Route, Navigate } from 'react-router'

import { userService } from './services/user'
// import { HomePage } from './pages/HomePage'
import { AboutUs, AboutTeam, AboutVision } from './pages/AboutUs'
import { StayIndex } from './pages/StayIndex.jsx'
import { UserOrders } from './pages/UserOrders.jsx'
import { ReviewIndex } from './pages/ReviewIndex.jsx'
import { ChatApp } from './pages/Chat.jsx'
import { AdminIndex } from './pages/AdminIndex.jsx'
import { ExperienceIndex } from './pages/ExperienceIndex.jsx'
import { ServiceIndex } from './pages/ServiceIndex.jsx'
import { HostOrdersPage } from './pages/HostOrdersPage.jsx'

import { StayDetails } from './pages/StayDetails'
import { StayDetail } from './pages/StayDetail'
import { BookingOrderPage } from './pages/BookingOrderPage.jsx'
import { UserDetails } from './pages/UserDetails'

import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg.jsx'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { Login } from './pages/Login.jsx'
import { Signup } from './pages/Signup.jsx'
import { StayResults } from './pages/StayResults.jsx'

export function RootCmp() {
  return (
    <div className='main-container'>
      {/* <AppHeader /> */}
      <UserMsg />

      <main>
        <Routes>
          <Route path='/' element={<StayIndex />} />
          <Route path='about' element={<AboutUs />}>
            <Route path='team' element={<AboutTeam />} />
            <Route path='vision' element={<AboutVision />} />
          </Route>
          <Route path='stay' element={<StayIndex />} />
          <Route path='experiences' element={<ExperienceIndex />} />
          <Route path='services' element={<ServiceIndex />} />
          <Route path='stay/results' element={<StayResults />} />
          <Route path='stay/:stayId' element={<StayDetails />} />
          <Route path='rooms/:stayId' element={<StayDetail />} />
          <Route path='stay/:stayId/booking' element={<BookingOrderPage />} />
          <Route path='user/:id' element={<UserDetails />} />
          <Route path='user/orders' element={<UserOrders />} />
          <Route path='host/orders' element={<HostOrdersPage />} />

          <Route path='review' element={<ReviewIndex />} />
          <Route path='chat' element={<ChatApp />} />
          <Route
            path='admin'
            element={
              <AuthGuard checkAdmin={true}>
                <AdminIndex />
              </AuthGuard>
            }
          />
          {/* LoginSignUpModal */}
          {/* <Route path='login' element={<LoginSignup />}>
            <Route index element={<Login />} />
            <Route path='signup' element={<Signup />} />
          </Route> */}
        </Routes>
      </main>
      {/* <AppFooter /> */}
    </div>
  )
}

function AuthGuard({ children, checkAdmin = false }) {
  const user = userService.getLoggedinUser()
  const isNotAllowed = !user || (checkAdmin && !user.isAdmin)
  if (isNotAllowed) {
    console.log('Not Authenticated!')
    return <Navigate to='/' />
  }
  return children
}
