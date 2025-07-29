import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { loadStays, addStay, updateStay, removeStay, addStayMsg } from '../store/stay.actions.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { stayService } from '../services/stay/index.js'

import { StayList } from '../cmps/StayList.jsx'
import { StayFilter } from '../cmps/StayFilter.jsx'

import { AppHeader } from '../cmps/AppHeader'
import { AirbnbLoader } from '../cmps/AirbnbLoader.jsx'

export function ExperienceIndex() {
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

  // async function onRemoveStay(stayId) {
  //     try {
  //         await removeStay(stayId)
  //         showSuccessMsg('Stay removed')
  //     } catch (err) {
  //         showErrorMsg('Cannot remove stay')
  //     }
  // }

  // async function onAddStay() {
  //     const stay = stayService.getEmptyStay()
  //     stay.price = prompt('price')
  //     try {
  //         const savedStay = await addStay(stay)
  //         showSuccessMsg(`Stay added (id: ${savedStay._id})`)
  //     } catch (err) {
  //         showErrorMsg('Cannot add stay')
  //     }
  // }

  // async function onUpdateStay(stay) {
  //     const speed = +prompt('New speed?', stay.speed)
  //     if (!speed) return
  //     const stayToSave = { ...stay, speed }
  //     try {
  //         const savedStay = await updateStay(stayToSave)
  //         showSuccessMsg(`Stay updated, new speed: ${savedStay.speed}`)
  //     } catch (err) {
  //         showErrorMsg('Cannot update stay')
  //     }
  // }

  return (
    <main className='stay-index'>
      <div className='header'>
        <AppHeader />
      </div>
      <header>
        {/* <h2>Stays</h2> */}
        {/* {userService.getLoggedinUser() && <button onClick={onAddStay}>Add a Stay</button>} */}
      </header>

      {/* <StayFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} /> */}

      {isLoading ? (
        <AirbnbLoader />
      ) : (
        <StayList
          stays={stays}
          // onRemoveStay={onRemoveStay}
          // onUpdateStay={onUpdateStay}
        />
      )}
    </main>
  )
}
