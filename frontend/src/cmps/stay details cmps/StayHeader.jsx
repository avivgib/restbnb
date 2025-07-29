/* eslint react/prop-types: 0 */

export const StayHeader = ({ name, loc, labels, rating }) => {
  const displayName = name || 'Unnamed Stay'
  const displayLoc = loc?.city && loc?.country ? `${loc.city}, ${loc.country}` : 'Unknown location'
  const displayRating = rating || 4.5
  const displayLabels = labels?.length ? labels : ['Top-rated']

  const nameParts = displayName.split(' ')
  const firstWord = nameParts.shift()
  const restOfName = nameParts.join(' ')

  return (
    <section className='stay-header'>
      <h1 className='stay-title'>
        <strong>{firstWord}</strong> {restOfName}
      </h1>
      <div className='stay-subtitle'>
        <span>{displayLoc}</span>
        <span className='stay-header-separator'>•</span>
        <span>⭐ {displayRating}</span>
      </div>
      <div className='stay-labels'>
        {displayLabels.map((label, idx) => (
          <span className='label' key={idx}>
            {label}
          </span>
        ))}
      </div>
    </section>
  )
}
