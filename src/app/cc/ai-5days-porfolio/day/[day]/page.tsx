import DayWorkbook from './DayWorkbook'

export function generateStaticParams() {
  return [{ day: '1' }, { day: '2' }, { day: '3' }, { day: '4' }, { day: '5' }]
}

export default async function DayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params
  return <DayWorkbook day={day} />
}
