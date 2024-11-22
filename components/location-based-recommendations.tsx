import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SportsClass {
  id: string
  facilityName: string
  sportName: string
  latitude: number | null
  longitude: number | null
}

interface LocationBasedRecommendationsProps {
  userLocation: { latitude: number; longitude: number }
  sportsClasses: SportsClass[]
}

export function LocationBasedRecommendations({ userLocation, sportsClasses }: LocationBasedRecommendationsProps) {
  const nearbyClasses = useMemo(() => {
    return sportsClasses
      .filter(cls => cls.latitude && cls.longitude)
      .map(cls => ({
        ...cls,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          cls.latitude!,
          cls.longitude!
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
  }, [userLocation, sportsClasses])

  return (
    <Card>
      <CardHeader>
        <CardTitle>근처 추천 강좌</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {nearbyClasses.map(cls => (
            <li key={cls.id} className="flex justify-between items-center">
              <span>{cls.facilityName} - {cls.sportName}</span>
              <span className="text-sm text-gray-500">{cls.distance.toFixed(1)}km</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}