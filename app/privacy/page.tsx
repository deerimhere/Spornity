import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Spornity
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">개인정보처리방침</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-r" role="alert">
              <p className="font-bold">중요 공지:</p>
              <p>Spornity는 공모전 및 개인 포트폴리오 용도로 제작되었으며, 어떠한 상업적 목적으로도 사용되지 않습니다. 실제 개인정보는 수집되거나 저장되지 않습니다.</p>
            </div>
            
            <p className="text-lg text-gray-700">
              Spornity는 사용자의 개인정보를 중요하게 생각하며, 개인정보보호법을 준수합니다.
            </p>

            {[
              { title: "1. 개인정보의 처리 목적", content: "Spornity는 데모 프로젝트로, 실제로 개인정보를 수집하거나 저장하지 않습니다. 모든 데이터는 시연 목적으로만 사용되며, 서비스 종료 시 즉시 파기됩니다." },
              { title: "2. 개인정보의 처리 및 보유 기간", content: "사용자가 입력한 정보는 서비스 이용 중에만 임시로 처리되며, 별도로 저장되거나 보관되지 않습니다." },
              { title: "3. 개인정보의 제3자 제공", content: "Spornity는 사용자의 개인정보를 제3자에게 제공하지 않습니다." },
              { title: "4. 이용자 및 법정대리인의 권리와 그 행사방법", content: "본 서비스는 데모용이므로, 실제 개인정보 열람, 정정, 삭제 등의 기능은 제공되지 않습니다." },
            ].map((section, index) => (
              <div key={index} className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-800">{section.title}</h2>
                <p className="text-gray-600">{section.content}</p>
                {index < 3 && <Separator className="my-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2024 Spornity. 모든 권리 보유.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4">이용약관</Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4">개인정보처리방침</Link>
          <Link href="/accessibility" className="text-xs hover:underline underline-offset-4">접근성 정책</Link>
        </nav>
      </footer>
    </div>
  )
}
