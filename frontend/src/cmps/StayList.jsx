import { StayCarousel } from './StayCarousel'

export function StayList({ stays }) {
  const staySections = [
    { title: "Popular homes in Rome", start: 14, end: 24 },
    { title: "Available next month in Barcelona", start: 24, end: 34 },
    { title: "Stay in Athens", start: 34, end: 44 },
    { title: "Available in London this weekend", start: 44, end: 54 },
    { title: "Available next month in Bucharest", start: 54, end: 64 },
    { title: "Popular homes in Vienna", start: 64, end: 74 },
    { title: "Stay in Lisbon", start: 74, end: 84 },
  ]

  return (
    <>
      {staySections.map(({ title, start, end }) => (
        <StayCarousel key={title} title={title} stays={stays.slice(start, end)} />
      ))}
    </>
  )
}
