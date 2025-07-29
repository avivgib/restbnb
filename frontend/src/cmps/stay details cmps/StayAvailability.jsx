import { useMemo, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { useAvailability } from '../../customHooks/useAvailability.js'
import { isValid, isSameDay } from 'date-fns'

export const StayAvailability = ({
  availability,
  onDateSelect,
  location = 'Location',
  minNights = 2,
  checkInDate,
  checkOutDate,
}) => {
  const {
    checkIn,
    checkOut,
    getTitles,
    disabledDays,
    handleSelect,
    clearSelection,
    isLastDayOfRange,
    allowsMinNightsToRangeEnd,
    isValidCheckIn,
    errorMessage,
    currentMonth,
  } = useAvailability({ availability, onDateSelect, minNights, checkInDate, checkOutDate })

  const [displayedMonth, setDisplayedMonth] = useState(checkIn || checkInDate || new Date())

  const { main, sub } = getTitles(location)

  const selectedRange = useMemo(() => {
    if (checkIn && isValid(checkIn)) {
      return {
        from: checkIn,
        to: checkOut && isValid(checkOut) ? checkOut : undefined,
      }
    }
    if (!checkIn && checkInDate && isValid(checkInDate)) {
      return {
        from: checkInDate,
        to: checkOutDate && isValid(checkOutDate) ? checkOutDate : undefined,
      }
    }
    return undefined
  }, [checkIn, checkOut, checkInDate, checkOutDate])

  const modifiers = {
    lastDay: (date) => isLastDayOfRange(date),
    invalidCheckIn: (date) => !allowsMinNightsToRangeEnd(date) && !isLastDayOfRange(date),
    checkIn: (date) =>
      (checkIn && isValid(checkIn) && isSameDay(date, checkIn)) ||
      (!checkIn && checkInDate && isValid(checkInDate) && isSameDay(date, checkInDate)),
    checkOut: (date) =>
      (checkOut && isValid(checkOut) && isSameDay(date, checkOut)) ||
      (!checkIn && !checkOut && checkOutDate && isValid(checkOutDate) && isSameDay(date, checkOutDate)),
  }

  const modifiersClassNames = {
    lastDay: 'last-day',
    invalidCheckIn: 'invalid-check-in',
    checkIn: 'check-in',
    checkOut: 'check-out',
  }

const renderDayContent = (date) => {
    const dayNum = date.getDate()
    const isLast = isLastDayOfRange(date)
    const isInvalidCheckIn = !allowsMinNightsToRangeEnd(date) && !isLast
    const isCheckInDay =
      (checkIn && isValid(checkIn) && isSameDay(date, checkIn)) ||
      (!checkIn && checkInDate && isValid(checkInDate) && isSameDay(date, checkInDate))
    const isCheckOutDay =
      (checkOut && isValid(checkOut) && isSameDay(date, checkOut)) ||
      (!checkIn && !checkOut && checkOutDate && isValid(checkOutDate) && isSameDay(date, checkOutDate))

    const classes = [
      'rdp-day',
      isLast ? 'last-day' : '',
      isInvalidCheckIn ? 'invalid-check-in' : '',
      isCheckInDay ? 'check-in' : '',
      isCheckOutDay ? 'check-out' : '',
    ].filter(Boolean).join(' ')

    const tooltip = isLast
      ? 'Checkout only'
      : isInvalidCheckIn
        ? `${minNights}-night minimum`
        : isCheckInDay
          ? 'Check-in'
          : isCheckOutDay
            ? 'Check-out'
            : null

    return (
      <div className={classes} data-tooltip={tooltip}>
        {dayNum}
      </div>
    )
  }

  return (
    <div className="stay-availability">
      <h3 className="availability-title">{main}</h3>
      <h4 className="availability-subtitle">{sub}</h4>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <DayPicker
        key={`${checkIn?.toISOString() || checkInDate?.toISOString() || 'no-checkin'}-${
          checkOut?.toISOString() || checkOutDate?.toISOString() || 'no-checkout'
        }`}
        animate
        mode="range"
        min={minNights}
        selected={selectedRange}
        onSelect={handleSelect}
        numberOfMonths={2}
        month={displayedMonth}
        onMonthChange={setDisplayedMonth}
        disabled={disabledDays}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        components={{ DayContent: renderDayContent }}
        className="rdp-root"
        navLayout="around"
        fromMonth={new Date()}
      />

      <div className="selected-dates">
        <button onClick={clearSelection} className="clear-button">
          Clear dates
        </button>
      </div>
    </div>
  )
}
