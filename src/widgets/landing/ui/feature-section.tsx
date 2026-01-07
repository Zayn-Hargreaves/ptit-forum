import { LANDING_FEATURES } from '@entities/landing/model/features';
import { Card, CardContent } from '@shared/ui/card/card';

export function FeaturesSection() {
  return (
    <section className="bg-background border-b py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Tất cả những gì bạn cần
          </h2>
          <p className="text-muted-foreground text-lg text-pretty">
            Một nền tảng tích hợp đầy đủ các công cụ hỗ trợ học tập và kết nối sinh viên
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {LANDING_FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="hover:border-primary/50 border-2 transition-all hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="bg-primary/10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                  <feature.icon className="text-primary h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
