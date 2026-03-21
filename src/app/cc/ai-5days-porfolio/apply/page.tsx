'use client'

import dynamic from 'next/dynamic'

const ApplyForm = dynamic(() => import('./ApplyForm'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-[#c8ff00] text-xl">로딩중...</div>
    </div>
  ),
})

export default function AI5DayApplyPage() {
  return <ApplyForm />
}
