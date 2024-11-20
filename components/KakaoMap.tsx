'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

interface KakaoMapProps {
  latitude: number
  longitude: number
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any
  }
}

export default function KakaoMap({ latitude, longitude }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  const loadKakaoMap = () => {
    if (typeof window.kakao === 'undefined' || !mapRef.current) return

    window.kakao.maps.load(() => {
      const mapOption = {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: 3
      }
      const map = new window.kakao.maps.Map(mapRef.current, mapOption)
      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude)
      const marker = new window.kakao.maps.Marker({
        position: markerPosition
      })
      marker.setMap(map)
    })
  }

  useEffect(() => {
    loadKakaoMap()
  }, [latitude, longitude])

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
        onLoad={loadKakaoMap}
      />
      <div ref={mapRef} style={{ width: '100%', height: '300px' }} />
    </>
  )
}