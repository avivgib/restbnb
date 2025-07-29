import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { StayListResults } from '../cmps/StayListResults.jsx'
import { StayMapList } from '../cmps/StayMapList.jsx'
import { StayResultsHeader } from '../cmps/StayResultsHeader.jsx'
import { AppFooter } from '../cmps/AppFooter'

export function StayResults() {
  const location = useLocation()
  const navigate = useNavigate()
  const stays = location.state?.filteredStays || []
  const selectedValues = location.state?.filterBy || []
  const checkIn = selectedValues.checkIn
  const checkOut = selectedValues.checkOut
  const guests = selectedValues.guests || {}
  const adults = 4
  const children = 0
  const infants = 1
  const pets = 1
  const handleSelectStay = useCallback(
    (stayId) => {
      const searchParams = new URLSearchParams({
        check_in: checkIn ? new Date(checkIn).toISOString().split('T')[0] : '',
        check_out: checkOut ? new Date(checkOut).toISOString().split('T')[0] : '',
        adults,
        children,
        infants,
        pets,
      })
      navigate(`/rooms/${stayId}?${searchParams.toString()}`)
    },
    [navigate, selectedValues]
  )

  return (
    <main className='stay-results'>
      <StayResultsHeader />
      <div className='stay-results-main'>
        {/* <section className='stay-list-container'> */}
        <div className='stay-results-left'>
          {/* <h2>Search Results</h2> */}
          <h2>{stays.length} places in {stays[0].loc.city}</h2>
          <div className='stay-results-grid'>
            <StayListResults
              stays={stays}
              searchDates={{
                checkIn: selectedValues.checkIn,
                checkOut: selectedValues.checkOut,
              }}
            />{' '}
          </div>
        </div>
        {/* </section> */}
        {/* <section className='stay-map-container'> */}
        <aside className='stay-results-right'>
          <StayMapList stays={stays} onSelectStay={handleSelectStay} />
        </aside>
        {/* </section> */}
      </div>
      <AppFooter />
    </main>

    // {/* <div className="stay-results">
    //   <Header /> {/* Your header component */}
    //   <main className="stay-results-main">
    //     <div className="stay-results-left">
    //       <h2>Search Results</h2>
    //           <StayListResults
    //             stays={stays}
    //             searchDates={{
    //               checkIn: selectedValues.checkIn,
    //               checkOut: selectedValues.checkOut,
    //             }}
    //           />{' '}
    //     </div>
    //     <aside className="stay-results-right">
    //       <StayMapList stays={stays} onSelectStay={handleSelectStay} />
    //     </aside>
    //   </main>
    //   <Footer /> {/* Your footer component */}
    // </div> */}
  )
}
