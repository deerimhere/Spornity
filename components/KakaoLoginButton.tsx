"use client"

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
  }
}

export function KakaoLoginButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js'
    script.async = true
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        const appKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY
        if (!appKey) {
          setError('Kakao App Key is not defined')
          return
        }
        window.Kakao.init(appKey)
      }
    }
    script.onerror = () => setError('Failed to load Kakao SDK')
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleKakaoLogin = () => {
    setIsLoading(true)
    setError(null)
    if (window.Kakao && window.Kakao.Auth) {
      window.Kakao.Auth.login({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        success: function(authObj: any) {
          console.log(authObj)
          // TODO: 성공적인 로그인 처리 (예: 서버에 토큰 전송)
          setIsLoading(false)
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fail: function(err: any) {
          console.error(err)
          setError('Failed to login with Kakao')
          setIsLoading(false)
        },
      })
    } else {
      setError('Kakao SDK is not loaded')
      setIsLoading(false)
    }
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <Button 
      onClick={handleKakaoLogin}
      className="w-full bg-[#FEE500] text-black hover:bg-[#FEE500]/90"
      disabled={isLoading}
    >
      {isLoading ? '로그인 중...' : '카카오로 로그인'}
    </Button>
  )
}

