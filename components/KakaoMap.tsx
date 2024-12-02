'use client'

import { useEffect, useRef } from 'react'

// Define types for Kakao Maps API
declare global {
  interface Window {
    kakao: {
      maps: KakaoMaps;
    };
  }
}

interface KakaoMaps {
  LatLng: new (lat: number, lng: number) => LatLng;
  Map: new (container: HTMLElement, options: MapOptions) => Map;
  Marker: new (options: MarkerOptions) => Marker;
}

interface LatLng {
  getLat(): number;
  getLng(): number;
}

interface MapOptions {
  center: LatLng;
  level: number;
}

interface Map {
  setCenter(latlng: LatLng): void;
}

interface MarkerOptions {
  position: LatLng;
}

interface Marker {
  setMap(map: Map | null): void;
}

interface KakaoMapProps {
  latitude: number;
  longitude: number;
}

export default function KakaoMap({ latitude, longitude }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current) {
      const { kakao } = window;

      const position = new kakao.maps.LatLng(latitude, longitude);
      const options: MapOptions = {
        center: position,
        level: 3
      };

      const map = new kakao.maps.Map(mapRef.current, options);
      const marker = new kakao.maps.Marker({
        position: position
      });

      marker.setMap(map);
    }
  }, [latitude, longitude]);

  return <div ref={mapRef} style={{ width: '100%', height: '300px' }} />;
}