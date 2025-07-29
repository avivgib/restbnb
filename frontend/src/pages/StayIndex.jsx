import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

//import { loadStays, addStay, updateStay, removeStay, addStayMsg } from '../store/stay.actions.js'
import { loadStays } from '../store/stay.actions.js'

//import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { stayService } from '../services/stay/index.js'

import { StayList } from '../cmps/StayList.jsx'
//import { StayFilter } from '../cmps/StayFilter.jsx'
//import { AppHeader } from '../cmps/AppHeader'
import { StayIndexHeader } from '../cmps/StayIndexHeader'
import { AirbnbLoader } from '../cmps/AirbnbLoader.jsx'

import { AppFooter } from '../cmps/AppFooter'

import '../assets/styles/pages/StayIndex.scss'

export function StayIndex() {
  const [filterBy, setFilterBy] = useState(stayService.getDefaultFilter())
  const [isLoading, setIsLoading] = useState(true)
  const stays = useSelector((storeState) => storeState.stayModule.stays)

  useEffect(() => {
    setIsLoading(true)
    loadStays(filterBy).finally(() => setIsLoading(false))
  }, [filterBy])

  function onSetFilterBy(filterBy) {
    setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...filterBy }))
  }

  return (
    <main className='stay-index'>
      <div className='index-main-container'>
        <div className='header'>
          <StayIndexHeader />
        </div>
        <header>
          {/* <h2>Stays</h2> */}
          {/* {userService.getLoggedinUser() && <button onClick={onAddStay}>Add a Stay</button>} */}
        </header>

        <div className='stay-lists'>{isLoading ? <AirbnbLoader /> : <StayList stays={stays} />}</div>
      </div>
      <AppFooter />
    </main>
  )
}
