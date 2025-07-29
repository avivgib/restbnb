import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { stayService } from '../services/stay/index.js'
import { StayFilter } from './StayFilter.jsx'
import { userService } from '../services/user'
import { useNavigate } from 'react-router-dom'
import '../assets/styles/cmps/AppHeader.scss'

// LoginSignupModal
import { LoginSignupModal } from './LoginSignupModal'

export function AppHeader() {
  const underlineRef = useRef()
  const navRef = useRef()
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })
  const [menuOpen, setMenuOpen] = useState(false)
  const [filterBy, setFilterBy] = useState(stayService.getDefaultFilter())
  const loggedInUser = userService.getLoggedinUser()

  const loggedIn = !!loggedInUser

// LoginSignupModal
  const [isLoginModalOpen, setLoginModalOpen] = useState(false)

  // header behavior based on page type
  const pathname = location.pathname
  // apply same behavior to both homepage and "stay" page
  // const isStayPage = pathname.startsWith("/stay") || pathname==="/";
  const isStayPage = pathname.startsWith('/stay') || pathname.startsWith('/experiences') || pathname.startsWith('/services') || pathname === '/'

  const isStayDetailsPage = /^\/stay\/[^/]+/.test(pathname) // match /stay/<id>

  const [hasBeenAtTop, setHasBeenAtTop] = useState(true)

  // keep values when collapsing header
  const [searchState, setSearchState] = useState({
    whereInput: '',
    checkInDate: null,
    checkOutDate: null,
    guestCounts: {
      adults: 0,
      children: 0,
      infants: 0,
      pets: 0,
    },
  })

  // header behavior based on page type
  const [isSmallerSearchBar, setIsSmallerSearchBar] = useState(() => {
    return isStayDetailsPage ? true : false
  })

  //scrolling - expand trigger
  const [expandTrigger, setExpandTrigger] = useState(null)

  useEffect(() => {
    const activeLink = navRef.current?.querySelector('.app-header__nav-item.active')
    if (activeLink) {
      const { offsetLeft, offsetWidth } = activeLink
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth })
    } else {
      const fallback = navRef.current?.querySelector('.app-header__nav-item')
      if (location.pathname === '/stay' && fallback) {
        const { offsetLeft, offsetWidth } = fallback
        setUnderlineStyle({ left: offsetLeft, width: offsetWidth })
      }
    }
  }, [location])

  // Determine header style based on page type
  useEffect(() => {
    if (isStayDetailsPage) {
      setIsSmallerSearchBar(true)
    } else if (pathname === '/stay' && window.scrollY === 0) {
      setIsSmallerSearchBar(false)
    } else if (pathname === '/') {
      setIsSmallerSearchBar(false) // expand on home page
    } else {
      setIsSmallerSearchBar(false) // default for all other paths
    }
  }, [pathname])

  // scrolling - minimize only after scrolling from top
  useEffect(() => {
    // header behavior based on page type
    if (!isStayPage || isStayDetailsPage) return

    const handleScroll = () => {
      const scrollTop = window.scrollY

      // When user is at the top, mark it
      if (scrollTop === 0) {
        setHasBeenAtTop(true)
        setIsSmallerSearchBar(false)
        return
      }

      // Only shrink again if user has been to top after expanding
      if (hasBeenAtTop && scrollTop > 10) {
        setIsSmallerSearchBar(true)
        setHasBeenAtTop(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isStayPage, isStayDetailsPage, hasBeenAtTop, pathname])
  //
  useEffect(() => {
    if (pathname === '/stay' && window.scrollY > 1) {
      setIsSmallerSearchBar(true)
      setHasBeenAtTop(false)
    }
  }, [pathname])
  //

  const toggleMenu = () => setMenuOpen((prev) => !prev)

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Fix click on header outside search bar collapse:
      const isInsideSearchBar = e.target.closest('.app-header__search-bar')
      const isInsideHeader = e.target.closest('.app-header')

      const isDetailsCollapse = isStayDetailsPage && !isInsideSearchBar && !isInsideHeader
      const isStickyCollapse = isStayPage && !isStayDetailsPage && !isInsideSearchBar && !isInsideHeader && window.scrollY > 1

      if ((isStickyCollapse || isDetailsCollapse) && !isSmallerSearchBar) {
        setIsSmallerSearchBar(true)
        setHasBeenAtTop(false)
      }

      const isClickInsideUserMenu = e.target.closest('.user-menu') || e.target.closest('.app-header__menu-btn')
      if (!isClickInsideUserMenu) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSmallerSearchBar]) // expand on click on smaller search bar:

  function onSetFilter(filterBy) {
    setFilterBy((prevFilter) => ({ ...prevFilter, ...filterBy }))
  }

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

        {/* Determining small/expanded header/search bar */}
        {isSmallerSearchBar ? (
          // click to expand small header:
          <div className='app-header__search-inline'>
            {/* keeping search bar values */}
            <StayFilter
              isSmallerSearchBar={true}
              searchState={searchState}
              setSearchState={setSearchState}
              onMiniSearchClick={(target) => {
                setExpandTrigger(target)
                setIsSmallerSearchBar(false)
              }}
            />
          </div>
        ) : (
          <nav className='app-header__nav'>
            <div className='app-header__nav-items' ref={navRef}>
              {/* nav links (Homes, Experiences, Services) */}
              <NavLink to='/stay' className='app-header__nav-item' end>
                <div className='icon-container'>
                  <img src='/img/homes0.png' alt='Homes' className='icon default' />
                  <img src='/img/homes1.png' alt='Homes Hover' className='icon hover' />
                </div>
                Homes
              </NavLink>
              <NavLink to='/experiences' className='app-header__nav-item'>
                <div className='icon-container'>
                  <img src='/img/experiences0.png' alt='Experiences' className='icon default' />
                  <img src='/img/experiences1.png' alt='Experiences Hover' className='icon hover' />
                </div>
                Experiences
              </NavLink>
              <NavLink to='/services' className='app-header__nav-item'>
                <div className='icon-container'>
                  <img src='/img/services0.png' alt='Services' className='icon default' />
                  <img src='/img/services1.png' alt='Services Hover' className='icon hover' />
                </div>
                Services
              </NavLink>
              <div
                ref={underlineRef}
                className='app-header__nav-underline'
                style={{ left: `${underlineStyle.left}px`, width: `${underlineStyle.width}px` }}
              ></div>
            </div>
          </nav>
        )}

        <div className='app-header__profile'>
          <NavLink to='/host/orders' className='app-header__host'>
          {loggedIn ? 'Switch to hosting' : 'Become a host'}
          </NavLink>

          {/* New globe/profile pic button */}
          {loggedIn ? (
            <div className='app-header__icon-btn profile-pic'>
              <img src='/img/profilepic.png' alt='User' />
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
                {/* LoginSignupModal */}
                {/* <div className='menu-item' onClick={() => navigate('/login')}> */}
                <div className='menu-item' onClick={() => {
                  setLoginModalOpen(true)
                  setMenuOpen(false)
                }}
                  >
                  Log in or sign up
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {!isSmallerSearchBar && (
        <div className='app-header__search-wrapper'>
          {/* keep search bar values */}
          <StayFilter
            isSmallerSearchBar={isSmallerSearchBar}
            expandTrigger={expandTrigger}
            clearExpandTrigger={() => setExpandTrigger(null)}
            searchState={searchState}
            setSearchState={setSearchState}
            filterBy={filterBy}
            onSetFilter={onSetFilter}
          />
        </div>
      )}

{/* LoginSignupModal */}
{isLoginModalOpen && (
  <LoginSignupModal onClose={() => setLoginModalOpen(false)} />
)}

    </header>
  )
}
