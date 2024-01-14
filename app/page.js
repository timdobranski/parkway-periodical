'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter();
  router.push('/public/home');


  return (
    <h1>Render Posts Here</h1>
  )
}