import { StayResultsPreview } from './StayResultsPreview'

export function StayListResults({ stays, searchDates }) {
  if (!stays?.length) return <p>No stays found.</p>

  return (
    // <section className='stay-simple-list'>
    <>
      {stays.map((stay) => (
        // <StayPreview key={stay._id} stay={stay} searchDates={searchDates} />
        <StayResultsPreview key={stay._id} stay={stay} searchDates={searchDates} />
      ))}
    </>
    // </section>
  )
}
