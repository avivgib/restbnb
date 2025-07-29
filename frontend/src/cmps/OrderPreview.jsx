// OrderPreview.jsx
import { useNavigate } from 'react-router-dom'
import { format, isSameMonth } from 'date-fns'

export function OrderPreview({ order, stay, host }) {
  const navigate = useNavigate()

  if (!stay || !host) return null

  var displaySelectedMethod =  order.paymentMethod.type.charAt(0).toUpperCase() + order.paymentMethod.type.slice(1).toLowerCase();
  var displayOrderStatus =  order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase();
  var hostFirstName = host.fullname.split(' ')[0];

  var displayCurrency = '$';

  switch (order.currency) {
    case 'ILS':
      displayCurrency = '₪';
      break;
    case 'USD':
      displayCurrency = '$';
      break;
    default:
      displayCurrency = order.currency; 
  }
  var checkin = new Date(order.checkin)
  var displayCheckInDate = checkin.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  
  var checkout = new Date(order.checkout)
  var displayCheckOutDate = checkout.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })


  function formatDateRange(checkin, checkout) {
      if (!checkin || !checkout) return 'No dates selected'
  
      const checkinDate = new Date(checkin)
      const checkoutDate = new Date(checkout)
  
      if (isNaN(checkinDate) || isNaN(checkoutDate)) {
        return 'Invalid dates'
      }
  
      const checkinYear = checkinDate.getFullYear()
      const checkoutYear = checkoutDate.getFullYear()
      const isSameYear = checkinYear === checkoutYear
  
      const sameMonth = isSameMonth(checkinDate, checkoutDate)
  
      const checkinFormatted = format(checkinDate, 'MMM d')
      const checkoutFormatted = sameMonth
        ? format(checkoutDate, 'd')
        : format(checkoutDate, 'MMM d')
  
      return isSameYear
        ? `${checkinFormatted} - ${checkoutFormatted}, ${checkinYear}`
        : `${checkinFormatted}, ${checkinYear} - ${checkoutFormatted}, ${checkoutYear}`
    }
  
  return (
<li className='order-preview'>
 <div className='preview-cell destination'>
   <img src={stay.imgUrls[0]} alt={stay.name} className='order-img' onClick={() => navigate(`/stay/${stay._id}`)}/>
   <div className="stay-name-dates">
   <div className="stay-name"onClick={() => navigate(`/stay/${stay._id}`)}>{stay.name}</div>
   {/* <div className="dates">{displayCheckInDate} - {displayCheckOutDate}</div> */}
   <div className="dates">{formatDateRange(order.checkin, order.checkout)}</div>
   
    </div>
</div>

<div className='preview-cell host'>
 <span><img src={host.imgUrl} alt={hostFirstName} className='host-avatar' /></span>
 <span>Hosted by {hostFirstName}</span>
</div>

<div className='preview-cell guests'>
 {(() => {
    const parts = []
    parts.push(`${order.guests.adults} ${order.guests.adults === 1 ? 'adult' : 'adults'}`)
    if (order.guests.children > 0) {
      parts.push(`${order.guests.children} ${order.guests.children === 1 ? 'child' : 'children'}`)
    }
    if (order.guests.infants > 0) {
      parts.push(`${order.guests.infants} ${order.guests.infants === 1 ? 'infant' : 'infants'}`)
    }
    if (order.guests.pets > 0) {
      parts.push(`${order.guests.pets} ${order.guests.pets === 1 ? 'pet' : 'pets'}`)
    }
    if (parts.length <= 2) {
      return parts.join(', ')
    } else {
      return (
        <>
          {parts.slice(0, 2).join(', ')},<br />
          {parts.slice(2).join(', ')}
        </>
      )
    }
  })()}
</div>

<div className='preview-cell total-price'>{displayCurrency}{order.priceDetails?.total}</div>
<div className={`preview-cell order-status`}><span className={`${order.status}`}></span>{displayOrderStatus}</div>
</li>
  )
}