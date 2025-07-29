import { useState, useRef } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { StayPreview } from './StayPreview'
import { SvgIcon } from './SvgIcon'

export function StayCarousel({ title, stays, staysPerPage = 7 }) {
    const sliderRef = useRef(null)
    const [currentSlide, setCurrentSlide] = useState(0)

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: staysPerPage,
        slidesToScroll: staysPerPage,
        arrows: false,
        afterChange: (index) => setCurrentSlide(index),
        responsive: [
            {
                breakpoint: 1439,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 6,
                }
            },
            {
                breakpoint: 1128,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                }
            },
            {
                breakpoint: 949,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                }
            },
            {
                breakpoint: 743,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            }
        ]
    }

    const isPrevDisabled = currentSlide === 0
    const isNextDisabled = currentSlide >= stays.length - settings.slidesToShow

    return (
        <section className="stay-carousel">
            <div className="list-header">
                <button className="title-btn">
                    <span>{title}</span>
                        <SvgIcon iconName="rightArrow" className="icon" />
                </button>
                <div className="carousel-controls">
                    <button
                        className={`arrow-btn ${isPrevDisabled ? 'disabled' : ''}`}
                        onClick={() => sliderRef.current?.slickPrev()}
                        disabled={isPrevDisabled}
                    >
                        <SvgIcon iconName={isPrevDisabled ? "leftDisableArrow" : "leftArrow" } />
                    </button>
                    <button
                        className={`arrow-btn ${isNextDisabled ? 'disabled' : ''}`}
                        onClick={() => sliderRef.current?.slickNext()}
                        disabled={isNextDisabled}
                    >
                        <SvgIcon iconName={ isNextDisabled ? "rightDisabledArrow" : "rightArrow" } />
                    </button>
                </div>
            </div>
            <Slider ref={sliderRef} {...settings} className="stay-list">
                {stays.map((stay) => (
                    <div key={stay._id || stay.id}>
                        <StayPreview stay={stay} />
                    </div>
                ))}
            </Slider>
        </section>
    )
}
