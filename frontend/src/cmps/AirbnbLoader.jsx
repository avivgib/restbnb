import airbnbLogo from '../assets/img/favicon.svg'

export function AirbnbLoader() {
  return (
    <div className='airbnb-loader'>
      <img src={airbnbLogo} alt='Loading...' />
    </div>
  )
}
