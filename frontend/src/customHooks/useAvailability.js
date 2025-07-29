import { useState, useEffect } from 'react'
import { differenceInDays, isSameDay, addDays, isValid, startOfDay } from 'date-fns'

// Custom hook for managing availability and date selection
export const useAvailability = ({ availability = { availableDates: [] }, onDateSelect, minNights = 2, checkInDate, checkOutDate }) => {
  const [checkIn, setCheckIn] = useState(checkInDate ? new Date(checkInDate) : null)
  const [checkOut, setCheckOut] = useState(checkOutDate ? new Date(checkOutDate) : null)
  const [availableRanges, setAvailableRanges] = useState([])
  const [selecting, setSelecting] = useState('checkIn') // Track selection state
  const [errorMessage, setErrorMessage] = useState(null) // Track error messages for invalid selections
  const [currentMonth, setCurrentMonth] = useState(new Date()) // Track current displayed month

  // Parse available dates
  useEffect(() => {
    const parsed = (availability?.availableDates || [])
      .map(({ startDate, endDate }) => ({
        start: new Date(startDate),
        end: new Date(endDate),
      }))
      .filter(({ start, end }) => isValid(start) && isValid(end))
    setAvailableRanges(parsed)
  }, [availability])

  // Check if a date is available
  const isDateAvailable = (date) => {
    if (!isValid(date)) return false
    return availableRanges.some((range) => date >= range.start && date <= range.end)
  }

  // Check if a date is the last day of a range
  const isLastDayOfRange = (date) => {
    if (!isValid(date)) return false
    return availableRanges.some((range) => isSameDay(date, range.end))
  }

  // Check if a date allows minNights to range end
  const allowsMinNightsToRangeEnd = (date) => {
    if (!isValid(date)) return false
    const range = availableRanges.find((r) => date >= r.start && date <= r.end)
    if (!range) return false
    return differenceInDays(range.end, date) >= minNights
  }

  // Validate check-in date
  const isValidCheckIn = (date) => {
    if (!isValid(date) || !isDateAvailable(date)) return false
    return !isLastDayOfRange(date) && allowsMinNightsToRangeEnd(date)
  }

  // Check if check-in and check-out satisfy minNights
  const allowsMinNights = (selectedCheckIn, selectedCheckOut) => {
    if (!isValid(selectedCheckIn) || !isValid(selectedCheckOut)) return false
    return differenceInDays(selectedCheckOut, selectedCheckIn) >= minNights
  }

  const getClosestCheckIn = (date) => {
    if (!isValid(date)) return null
    const range = availableRanges.find((r) => date >= r.start && date <= r.end)
    if (!range) return null
    const maxCheckIn = addDays(range.end, -minNights)
    return date > maxCheckIn ? maxCheckIn : date
  }

  // Check if a date is invalid as check-in (last day or doesn't allow minNights)
  const isCheckInTooCloseToRangeEnd = (date) => {
    if (!isValid(date)) return false
    const range = availableRanges.find((r) => date >= r.start && date <= r.end)
    if (!range) return false

    const maxCheckIn = addDays(range.end, -minNights) // Latest date allowing minNights
    return date > maxCheckIn && !isSameDay(date, range.end) // Invalid if too close to range end
  }

  // Get titles and subtitles
  // Calculate titles based on selection state
  const getTitles = (location = 'Location') => {
    if (!checkIn && !checkOut && checkInDate && checkOutDate && isValid(checkInDate) && isValid(checkOutDate)) {
      const nights = differenceInDays(checkOutDate, checkInDate)
      if (nights >= minNights && isDateAvailable(checkInDate) && isDateAvailable(checkOutDate)) {
        return {
          main: `${nights} ${nights === 1 ? 'night' : 'nights'} in ${location}`,
          sub: `${checkInDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })} - ${checkOutDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}`,
        }
      }
    }

    if (!checkIn && !checkOut) {
      return {
        main: 'Select check-in date',
        sub: `Minimum stay: ${minNights} ${minNights === 1 ? 'night' : 'nights'}`,
      }
    }
    if (checkIn && isDateAvailable(checkIn) && !checkOut) {
      if (isLastDayOfRange(checkIn)) {
        return {
          main: 'Select check-in date',
          sub: 'This date is unavailable for check-in.',
        }
      }
      const closestCheckIn = getClosestCheckIn(checkIn)
      if (isCheckInTooCloseToRangeEnd(checkIn) && closestCheckIn && !isSameDay(checkIn, closestCheckIn)) {
        return {
          main: 'Select check-in date',
          sub: `The closest available check-in date is ${closestCheckIn.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}.`,
        }
      }
      return {
        main: 'Select check-out date',
        sub: `Minimum stay: ${minNights} ${minNights === 1 ? 'night' : 'nights'}`,
      }
    }
    const nights = differenceInDays(checkOut, checkIn)
    return {
      main: `${nights} ${nights === 1 ? 'night' : 'nights'} in ${location}`,
      sub: `${checkIn.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })} - ${checkOut.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}`,
    }
  }

  // Determine disabled days
  const disabledDays = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Disable unavailable dates or dates before today
    if (!isDateAvailable(date) || date < today) return true

    // After valid checkIn, disable dates before checkIn or outside range
    if (checkIn && isValidCheckIn(checkIn) && !checkOut) {
      const range = availableRanges.find((r) => checkIn >= r.start && checkIn <= r.end)
      return date < checkIn || date > range.end
    }

    return false
  }

  // Handle date selection
  const handleSelect = ({ from, to }) => {
    const selectedDate = to || from
    if (!selectedDate || !isValid(selectedDate)) {
      clearSelection()
      return
    }

    // Update current month based on selected date
    setCurrentMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth()))

    // Clean state: Select new check-in
    if (!checkIn && !checkOut && selecting === 'checkIn') {
      if (isValidCheckIn(selectedDate)) {
        setCheckIn(selectedDate)
        setSelecting('checkOut')
        setErrorMessage(null)
        onDateSelect?.({ from: selectedDate, to: null })
      } else {
        setCheckIn(selectedDate) // Mark visually but don't save
        // setErrorMessage(isLastDayOfRange(selectedDate) ? 'Checkout only' : `${minNights} nights minimum`)
      }
      return
    }

    // Selecting check-out after valid check-in
    if (checkIn && isValidCheckIn(checkIn) && !checkOut && selecting === 'checkOut') {
      if (allowsMinNights(checkIn, selectedDate) && selectedDate > checkIn) {
        setCheckOut(selectedDate)
        setSelecting('checkIn')
        setErrorMessage(null)
        onDateSelect?.({ from: checkIn, to: selectedDate })
      } else {
        // setErrorMessage(`${minNights} nights minimum`)
        onDateSelect?.({ from: checkIn, to: null })
      }
      return
    }

    // Both checkIn and checkOut exist
    if (checkIn && checkOut && isValidCheckIn(checkIn) && isValid(checkOut)) {
      if (selecting === 'checkIn') {
        const range = availableRanges.find((r) => selectedDate >= r.start && selectedDate <= r.end)
        if (!range || !isValidCheckIn(selectedDate)) {
          clearSelection()
          setCheckIn(selectedDate) // Mark visually
          // setErrorMessage(isLastDayOfRange(selectedDate) ? 'Checkout only' : `${minNights} nights minimum`)
          onDateSelect?.({ from: null, to: null })
          return
        }

        // Check if new checkIn allows minNights with existing checkOut
        if (selectedDate < checkOut && allowsMinNights(selectedDate, checkOut)) {
          setCheckIn(selectedDate)
          setSelecting('checkOut')
          setErrorMessage(null)
          onDateSelect?.({ from: selectedDate, to: checkOut })
        } else if (allowsMinNightsToRangeEnd(selectedDate)) {
          setCheckIn(selectedDate)
          setCheckOut(null)
          setSelecting('checkOut')
          setErrorMessage(null)
          onDateSelect?.({ from: selectedDate, to: null })
        } else {
          clearSelection()
          setCheckIn(selectedDate) // Mark visually
          // setErrorMessage(`${minNights} nights minimum`)
          onDateSelect?.({ from: null, to: null })
        }
        return
      }

      if (selecting === 'checkOut') {
        if (allowsMinNights(checkIn, selectedDate) && selectedDate > checkIn) {
          setCheckOut(selectedDate)
          setSelecting('checkIn')
          setErrorMessage(null)
          onDateSelect?.({ from: checkIn, to: selectedDate })
        } else {
          // setErrorMessage(`${minNights} nights minimum`)
          onDateSelect?.({ from: checkIn, to: null })
        }
        return
      }
    }

    // Fallback: Treat as new check-in
    clearSelection()
    setCheckIn(selectedDate)
    setSelecting(isValidCheckIn(selectedDate) ? 'checkOut' : 'checkIn')
    // setErrorMessage(
    //   isLastDayOfRange(selectedDate) ? 'Checkout only' : !allowsMinNightsToRangeEnd(selectedDate) ? `${minNights} nights minimum` : null
    // )
    onDateSelect?.({ from: selectedDate, to: null })
  }

  // Clear selection
  const clearSelection = () => {
    setCheckIn(null)
    setCheckOut(null)
    setSelecting('checkIn')
    setErrorMessage(null)
    setCurrentMonth(new Date())
    onDateSelect?.({ from: null, to: null })
  }

  return {
    checkIn,
    checkOut,
    getTitles,
    disabledDays,
    handleSelect,
    clearSelection,
    isLastDayOfRange,
    allowsMinNightsToRangeEnd,
    isValidCheckIn,
    allowsMinNights,
    errorMessage,
    currentMonth,
  }
}