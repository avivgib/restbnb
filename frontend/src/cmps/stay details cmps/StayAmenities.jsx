import { useState } from 'react'

// Predefined list of all image files mapped to their display names
const amenityImageMap = {
  '1 bathroom': '/img/amenities/available/1 bathroom.png',
  '1 bed': '/img/amenities/available/1 bed.png',
  '1 double bed': '/img/amenities/available/1 double bed.png',
  '2 bathrooms': '/img/amenities/available/2 bathrooms.png',
  '2 beds': '/img/amenities/available/2 beds.png',
  '3 bathrooms': '/img/amenities/available/3 bathrooms.png',
  '3 beds': '/img/amenities/available/3 beds.png',
  'Air conditioning': '/img/amenities/available/Air conditioning.png',
  'Backyard': '/img/amenities/available/Backyard.png',
  'Balcony': '/img/amenities/available/Balcony.png',
  'Bathtub': '/img/amenities/available/Bathtub.png',
  'Beach access – Beachfront': '/img/amenities/available/Beach access – Beachfront.png',
  'Bed linens': '/img/amenities/available/Bed linens.png',
  'Blender': '/img/amenities/available/Blender.png',
  'Body soap': '/img/amenities/available/Body soap.png',
  'Books and reading material': '/img/amenities/available/Books and reading material.png',
  'Carbon monoxide alarm': '/img/amenities/available/Carbon monoxide alarm.png',
  'Cleaning available during stay': '/img/amenities/available/Cleaning available during stay.png',
  'Cleaning products': '/img/amenities/available/Cleaning products.png',
  'Clothing storage_ wardrobe and dresser': '/img/amenities/available/Clothing storage_ wardrobe and dresser.png',
  'Coffee machine': '/img/amenities/available/Coffee machine.png',
  'Coffee': '/img/amenities/available/Coffee.png',
  'Conditioner': '/img/amenities/available/Conditioner.png',
  'Cooking basics': '/img/amenities/available/Cooking basics.png',
  'Crib': '/img/amenities/available/Crib.png',
  'Dedicated workspace': '/img/amenities/available/Dedicated workspace.png',
  'Dishes and silverware': '/img/amenities/available/Dishes and silverware.png',
  'Dishwasher': '/img/amenities/available/Dishwasher.png',
  'Dryer': '/img/amenities/available/Dryer.png',
  'Elevator': '/img/amenities/available/Elevator.png',
  'Essentials': '/img/amenities/available/Essentials.png',
  'Extra pillows and blankets': '/img/amenities/available/Extra pillows and blankets.png',
  'Fire extinguisher': '/img/amenities/available/Fire extinguisher.png',
  'Free parking on premises': '/img/amenities/available/Free parking on premises.png',
  'Freezer': '/img/amenities/available/Freezer.png',
  'Garden view': '/img/amenities/available/Garden view.png',
  'Gym': '/img/amenities/available/Gym.png',
  'Hair dryer': '/img/amenities/available/Hair dryer.png',
  'Hangers': '/img/amenities/available/Hangers.png',
  'Heating': '/img/amenities/available/Heating.png',
  'High chair': '/img/amenities/available/High chair.png',
  'Hot water kettle': '/img/amenities/available/Hot water kettle.png',
  'Hot water': '/img/amenities/available/Hot water.png',
  'Inch HDTV': '/img/amenities/available/Inch HDTV.png',
  'Iron': '/img/amenities/available/Iron.png',
  'Kitchen': '/img/amenities/available/Kitchen.png',
  'Laundromat nearby': '/img/amenities/available/Laundromat nearby.png',
  'Lock on bedroom door': '/img/amenities/available/Lock on bedroom door.png',
  'Lockbox': '/img/amenities/available/Lockbox.png',
  'Long term stays allowed': '/img/amenities/available/Long term stays allowed.png',
  'Luggage dropoff allowed': '/img/amenities/available/Luggage dropoff allowed.png',
  'Microwave': '/img/amenities/available/Microwave.png',
  'Mini fridge': '/img/amenities/available/Mini fridge.png',
  'Oven': '/img/amenities/available/Oven.png',
  'Pack n play Travel crib': '/img/amenities/available/Pack n play Travel crib.png',
  'Paid parking off premises': '/img/amenities/available/Paid parking off premises.png',
  'Pets allowed': '/img/amenities/available/Pets allowed.png',
  'Private attached bathroom': '/img/amenities/available/Private attached bathroom.png',
  'Private entrance': '/img/amenities/available/Private entrance.png',
  'Private patio or balcony': '/img/amenities/available/Private patio or balcony.png',
  'Refrigerator': '/img/amenities/available/Refrigerator.png',
  'River view': '/img/amenities/available/River view.png',
  'Room-darkening shades': '/img/amenities/available/Room-darkening shades.png',
  'Self check-in': '/img/amenities/available/Self check-in.png',
  'Shampoo': '/img/amenities/available/Shampoo.png',
  'Shared bathroom': '/img/amenities/available/Shared bathroom.png',
  'Smart lock': '/img/amenities/available/Smart lock.png',
  'Smoke alarm (2)': '/img/amenities/available/Smoke alarm (2).png',
  'Smoke alarm': '/img/amenities/available/Smoke alarm.png',
  'Stove': '/img/amenities/available/Stove.png',
  'TV': '/img/amenities/available/TV.png',
  'Washer': '/img/amenities/available/Washer.png',
  'WiFi': '/img/amenities/available/WiFi.png',
  'Wine glasses': '/img/amenities/available/Wine glasses.png',
}

export const StayAmenities = ({ amenities }) => {
  const [showModal, setShowModal] = useState(false)
  const displayAmenities = amenities || Object.keys(amenityImageMap)
  const MAX_AMENITIES = 10
  const amenitiesToShow = displayAmenities.slice(0, MAX_AMENITIES)

  return (
    <section className='stay-amenities'>
      <h3>What this place offers</h3>
      <ul className='amenities-list'>
        {amenitiesToShow.map((item, idx) => (
          <li key={idx} className='amenity-item'>
            {amenityImageMap[item] && (
              <img src={amenityImageMap[item]} alt={item} className='amenity-icon' />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {displayAmenities.length > MAX_AMENITIES && (
        <button className="amenities-btn" onClick={() => setShowModal(true)}>
          Show all {displayAmenities.length} amenities
        </button>
      )}

      {showModal && (
        <div className="amenities-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="amenities-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              <img src="/img/close.png" alt="Close" />
            </button>
            <div className="modal-scroll-content">
              <h2>What this place offers</h2>
              <ul className="all-amenities-list">
                {displayAmenities.map((item, idx) => (
                  <li key={idx}>
                    <div className="modal-amenity-item">
                      {amenityImageMap[item] && (
                        <img src={amenityImageMap[item]} alt={item} className='amenity-icon' />
                      )}
                      <span>{item}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
