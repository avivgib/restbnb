import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { stayService } from '../services/stay/index.js'
import { StayFilter } from './StayFilter.jsx'
import { userService } from '../services/user'
import { useNavigate } from 'react-router-dom'

import '../assets/styles/cmps/MyReservationsHeader.scss'

export function MyReservationsHeader() {
  const underlineRef = useRef()
  const navRef = useRef()
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })
  const [menuOpen, setMenuOpen] = useState(false)
  const [filterBy, setFilterBy] = useState(stayService.getDefaultFilter())
  const location = useLocation()
  const navigate = useNavigate()

  const loggedInUser = userService.getLoggedinUser()

  const loggedIn = !!loggedInUser
  // header behavior based on page type
  const pathname = location.pathname
  // apply same behavior to both homepage and "stay" page
  // const isStayPage = pathname.startsWith("/stay") || pathname==="/";
  const isStayPage = pathname.startsWith('/stay') || pathname.startsWith('/experiences') || pathname.startsWith('/services') || pathname === '/'

  const isStayDetailsPage = /^\/stay\/[^/]+/.test(pathname) // match /stay/<id>

 useEffect(() => {
    
    const handleClickOutside = (e) => {

      const isClickInsideUserMenu = e.target.closest('.user-menu') || e.target.closest('.app-header__menu-btn')
      if (!isClickInsideUserMenu) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, []) 

  //scrolling - expand trigger
  const [expandTrigger, setExpandTrigger] = useState(null)

  const toggleMenu = () => setMenuOpen((prev) => !prev)

  function onLogout() {
    userService.logout()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    // header behavior based on page type
    <header className={`app-header ${isStayPage && !isStayDetailsPage ? 'fixed' : ''}`}>
      <div className='app-header__top-bar'>
        <div className='app-header__logo'>
          <NavLink to='/'>
            <img src='/img/logo.png' alt='restbnb logo' />
          </NavLink>
        </div>

        <div className='app-header__profile'>
          <NavLink to='/host/orders' className='app-header__host'>
          {loggedIn ? 'Switch to hosting' : 'Become a host'}
          </NavLink>

          {/* New globe/profile pic button */}
          {loggedIn ? (
            <div className='app-header__icon-btn profile-pic'>
              <img src={loggedInUser.imgUrl} alt='User' />
            </div>
          ) : (
            <div className='app-header__icon-btn'>
              <img src='/img/globe.png' alt='Language' />
            </div>
          )}

          <div className='app-header__menu-btn' onClick={toggleMenu}>
            <img src='/img/menu.png' alt='Menu' />
          </div>
        </div>

        {/* New logged-in/not logged-in menu toggle: */}
        {menuOpen && (
          <div className='user-menu'>
            {loggedIn ? (
              <>
                <div className='menu-item'>
                  <img src='/img/wishlists.png' alt='Wishlists' />
                  Wishlists
                </div>
                <div className='menu-item' onClick={() => navigate('/user/orders')}>
                  <img src='/img/trips.png' alt='Trips' />
                  Trips
                </div>

                <div className='menu-item'>
                  <img src='/img/messages.png' alt='Messages' />
                  Messages
                </div>
                <div className='menu-item'>
                  <img src='/img/profile.png' alt='Profile' />
                  Profile
                </div>
                <hr />
                <div className='menu-item'>
                  <img src='/img/settings.png' alt='Account Settings' />
                  Account settings
                </div>
                <div className='menu-item'>
                  <img src='/img/globe.png' alt='Languages & Currency' />
                  Languages & currency
                </div>
                <div className='menu-item'>
                  <img src='/img/help.png' alt='Help' />
                  Help Center
                </div>
                <hr />
                <div className='menu-item host-section'>
                  <div>
                    <div className='title'>Become a host</div>
                    <div className='subtitle'>It's easy to start hosting and earn extra income.</div>
                  </div>
                  <img src='/img/homes0.png' alt='Host' />
                </div>
                <hr />
                <div className='menu-item'>Refer a Host</div>
                <div className='menu-item'>Find a co-host</div>
                <div className='menu-item'>Gift cards</div>
                <hr />
                <div className='menu-item' onClick={onLogout}>
                  Log out
                </div>
              </>
            ) : (
              <>
                <div className='menu-item'>
                  <img src='/img/help.png' alt='Help' />
                  Help Center
                </div>
                <hr />
                <div className='menu-item host-section'>
                  <div>
                    <div className='title'>Become a host</div>
                    <div className='subtitle'>It's easy to start hosting and earn extra income.</div>
                  </div>
                  <img src='/img/homes0.png' alt='Host' />
                </div>
                <hr />
                <div className='menu-item'>Refer a Host</div>
                <div className='menu-item'>Find a co-host</div>
                <div className='menu-item'>Gift cards</div>
                <hr />
                <div className='menu-item' onClick={() => navigate('/login')}>
                  Log in or sign up
                </div>
              </>
            )}
          </div>
        )}
      </div>

    </header>
  )
}
