import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function AccessibilityPage() {
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
            <CardTitle className="text-3xl font-bold text-center">접근성 정책</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-r" role="alert">
              <p className="font-bold">중요 공지:</p>
              <p>Spornity는 공모전 및 개인 포트폴리오 용도로 제작되었으며, 어떠한 상업적 목적으로도 사용되지 않습니다.</p>
            </div>
            
            <p className="text-lg text-gray-700">
              Spornity는 모든 사용자가 쉽게 이용할 수 있는 웹 서비스를 제공하기 위해 노력합니다.
            </p>

            {[
              { title: "1. 접근성 목표", content: "Spornity는 웹 콘텐츠 접근성 지침(WCAG) 2.1의 AA 수준을 준수하는 것을 목표로 합니다. 이는 데모 프로젝트로서의 기술적 역량을 보여주기 위한 것입니다." },
              { title: "2. 핵심 접근성 기능", content: (
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>키보드 접근성: 모든 기능은 키보드만으로도 사용 가능합니다.</li>
                  <li>대체 텍스트: 모든 이미지에 적절한 대체 텍스트를 제공합니다.</li>
                  <li>색상 대비: 텍스트와 배경 간의 충분한 색상 대비를 보장합니다.</li>
                  <li>반응형 디자인: 다양한 기기와 화면 크기에 맞춰 조정됩니다.</li>
                </ul>
              )},
              { title: "3. 지속적인 개선", content: "Spornity는 데모 프로젝트이지만, 실제 서비스와 같이 지속적으로 접근성을 개선하는 과정을 시뮬레이션합니다." },
              { title: "4. 피드백", content: "접근성 관련 피드백은 프로젝트 개선에 큰 도움이 됩니다. 실제 운영되는 서비스는 아니지만, 개발자의 포트폴리오로서 접근성 관련 제안을 환영합니다." },
            ].map((section, index) => (
              <div key={index} className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-800">{section.title}</h2>
                {typeof section.content === 'string' ? (
                  <p className="text-gray-600">{section.content}</p>
                ) : (
                  section.content
                )}
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

