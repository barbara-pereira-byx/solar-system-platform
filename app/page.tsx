import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Telescope, Globe, BarChart3, BookOpen, Sparkles, ArrowRight, Users, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Planetário Universitário
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6">
              Explore o{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Sistema Solar
              </span>{" "}
              de forma interativa
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-pretty mb-8 max-w-3xl mx-auto">
              Uma plataforma educacional imersiva com visualizações 3D, dados científicos atualizados e atividades
              interativas para estudantes e professores.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/explorar">
                  <Globe className="h-5 w-5 mr-2" />
                  Começar Exploração
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                <Link href="/quizzes">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Fazer Quiz
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Recursos da Plataforma</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ferramentas educacionais avançadas para uma experiência de aprendizado única
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Visualização 3D</CardTitle>
                <CardDescription>
                  Modelos tridimensionais interativos dos planetas, luas e asteroides com simulações de órbitas em tempo
                  real.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Dados Científicos</CardTitle>
                <CardDescription>
                  Informações atualizadas sobre massa, raio, gravidade, temperatura e curiosidades de cada corpo
                  celeste.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4 group-hover:bg-chart-3/20 transition-colors">
                  <BarChart3 className="h-6 w-6 text-chart-3" />
                </div>
                <CardTitle>Comparações</CardTitle>
                <CardDescription>
                  Compare diferentes planetas e luas lado a lado, incluindo simulações de peso em diferentes gravidades.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-chart-4/10 flex items-center justify-center mb-4 group-hover:bg-chart-4/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-chart-4" />
                </div>
                <CardTitle>Quizzes Interativos</CardTitle>
                <CardDescription>
                  Atividades educativas e desafios que reforçam o aprendizado de forma lúdica e envolvente.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Telescope className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Extensão do Planetário</CardTitle>
                <CardDescription>
                  Complementa as atividades presenciais do planetário com acesso digital a qualquer momento.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para explorar o universo?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Comece sua jornada pelo Sistema Solar e descubra os mistérios do cosmos através de uma experiência
                educacional única e interativa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/explorar">
                    <Globe className="h-5 w-5 mr-2" />
                    Explorar Planetas
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
