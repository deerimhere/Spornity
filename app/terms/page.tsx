import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TermsPage() {
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
            <CardTitle className="text-3xl font-bold text-center">이용약관</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-r" role="alert">
              <p className="font-bold">중요 공지:</p>
              <p>Spornity는 공모전 및 개인 포트폴리오 용도로 제작되었으며, 어떠한 상업적 목적으로도 사용되지 않습니다.</p>
            </div>
            
            <p className="text-lg text-gray-700">
              본 이용약관은 Spornity 서비스 이용에 관한 기본적인 사항을 규정합니다.
            </p>

            {[
              { title: "1. 서비스 목적", content: "Spornity는 사용자들에게 스포츠 관련 정보와 커뮤니티 서비스를 제공하는 것을 목적으로 합니다. 본 서비스는 실제 운영되는 서비스가 아니며, 개발자의 기술 역량을 보여주기 위한 데모 프로젝트입니다." },
              { title: "2. 이용 제한", content: "본 서비스는 실제 운영되는 서비스가 아니므로, 사용자 데이터의 저장이나 실제 거래 등의 기능은 제한될 수 있습니다." },
              { title: "3. 책임의 한계", content: "Spornity는 데모 프로젝트이므로, 서비스 이용으로 인해 발생할 수 있는 어떠한 손해에 대해서도 책임을 지지 않습니다." },
              { title: "4. 지적재산권", content: "Spornity에 포함된 모든 콘텐츠의 저작권은 개발자에게 있으며, 개발자가 허용한 경우를 제외한 사용을 금지합니다." },
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
