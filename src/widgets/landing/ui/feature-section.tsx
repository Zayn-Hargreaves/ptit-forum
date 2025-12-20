import { Card, CardContent } from "@shared/ui/card/card";
import { LANDING_FEATURES } from "@entities/landing/model/features";

export function FeaturesSection() {
  return (
    <section className="border-b bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Tất cả những gì bạn cần
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Một nền tảng tích hợp đầy đủ các công cụ hỗ trợ học tập và kết nối
            sinh viên
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {LANDING_FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className="border-2 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
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
