/* eslint react/prop-types: 0 */

import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

export const StayGallery = ({ imgGallery }) => {
  
  const { stayId } = useParams()

  const images = imgGallery?.length
    ? imgGallery
    : [
        { url: 'https://a0.muscache.com/im/pictures/ad3bd125-b503-46a7-b0a9-8bda36819f6a.jpg?im_w=1200', caption: 'Placeholder 1' },
        { url: 'https://a0.muscache.com/im/pictures/e9f15d30-c47b-47cc-a887-7aaa798cd7fb.jpg?im_w=720', caption: 'Placeholder 2' },
        { url: 'https://a0.muscache.com/im/pictures/cc621a5e-c444-4e02-8437-2f399be2ac0a.jpg?im_w=720', caption: 'Placeholder 3' },
        { url: 'https://a0.muscache.com/im/pictures/abdecf9b-c66a-4a08-827e-dfed6bf1d230.jpg?im_w=720', caption: 'Placeholder 4' },
        { url: 'https://a0.muscache.com/im/pictures/49494624-6a5d-45d9-aa84-1df754fb28a4.jpg?im_w=720', caption: 'Placeholder 5' },
      ]

  const totalImages = images.length

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize() // בדיקה ראשונה

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <section className='stay-gallery'>
      {isMobile ? (
        // Mobile - show only first image as link
        <Link to={`/stay/${stayId}/photos`} className='gallery-item mobile'>
          <img src={images[0].url} alt={images[0].caption || `Image 1`} />
          <div className='mobile-photo-counter'>1 / {totalImages}</div>
        </Link>
      ) : (
        // Desktop - show grid of 5 images
        <div className='gallery-grid'>
          {images.slice(0, 5).map((img, idx) => {
            const isLast = idx === 4

            return (
              <div className={`gallery-item gallery-item-${idx + 1}`} key={idx}>
                <img src={img.url} alt={img.caption || `Image ${idx + 1}`} />

                {/* Desktop - show button */}
                {isLast && (
                  <Link to={`/stay/${stayId}/photos`} className='show-all-overlay'>
                    Show all photos
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
