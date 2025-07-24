import { Skeleton } from '@/components/ui/skeleton';
import { Container } from '@/components/ui/Container';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <Container>
          <div className="text-center">
            <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-6 w-2/3 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </Container>
      </section>
      
      {/* Social Proof Skeleton */}
      <section className="py-8 border-b">
        <Container>
          <div className="flex justify-center items-center gap-8 opacity-60">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>
        </Container>
      </section>
      
      {/* Calculator Section Skeleton */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
                
                {/* Calculate Button */}
                <div className="text-center">
                  <Skeleton className="h-12 w-48 mx-auto" />
                </div>
                
                {/* Results Section */}
                <div className="mt-8 p-6 bg-muted/50 rounded-lg">
                  <Skeleton className="h-8 w-1/4 mb-6" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="text-center">
                        <Skeleton className="h-8 w-full mb-2" />
                        <Skeleton className="h-5 w-2/3 mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
      
      {/* Stats Section Skeleton */}
      <section className="py-16 border-t">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-12 w-full mb-2" />
                <Skeleton className="h-5 w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        </Container>
      </section>
      
      {/* Features Section Skeleton */}
      <section className="py-16 lg:py-24 bg-muted/50">
        <Container>
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-1/3 mx-auto mb-4" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-12 mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
      
      {/* FAQ Section Skeleton */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-1/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}