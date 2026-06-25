import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { getServerDictionary } from '@/lib/i18n-server'
import { t } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: { lang?: 'en' | 'ar' } }) {
  const dict = await getServerDictionary(params.lang)

  return {
    title: t(dict, 'about.title'),
    description: t(dict, 'about.heroSubtitle'),
  }
}

export default async function AboutPage({ params }: { params: { lang?: 'en' | 'ar' } }) {

  const dict = await getServerDictionary(params.lang)

  return (
    <div className="min-h-full bg-background">

      <Header />

      {/* HERO */}
      <section className="relative h-[420px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da"
          alt="about hero"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl px-4">

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t(dict, 'about.heroTitle')}
            </h1>

            <p className="text-lg opacity-90">
              {t(dict, 'about.heroSubtitle')}
            </p>

          </div>
        </div>
      </section>


      {/* CONTENT */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 space-y-24">


        {/* STORY */}
        <section className="grid md:grid-cols-2 gap-12 items-center">

          <div className="relative h-[420px] w-full">
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
              alt="story"
              fill
              className="object-cover rounded-xl"
            />
          </div>

          <div>

            <h2 className="text-3xl font-bold mb-4">
              {t(dict, 'about.storyTitle')}
            </h2>

            <p className="text-foreground/70 leading-relaxed">
              {t(dict, 'about.storyText')}
            </p>

          </div>

        </section>


        {/* FEATURES */}
        <section>

          <h2 className="text-3xl font-bold text-center mb-12">
            {t(dict, 'about.why')}
          </h2>

          <div className="grid md:grid-cols-4 gap-8">

            <div className="p-6 rounded-xl border text-center">
              <h3 className="font-bold mb-2">
                {t(dict, 'about.premiumQuality')}
              </h3>

              <p className="text-sm text-muted-foreground">
                {t(dict, 'about.premiumQuality.desc')}
              </p>
            </div>

            <div className="p-6 rounded-xl border text-center">
              <h3 className="font-bold mb-2">
                {t(dict, 'about.fastShipping')}
              </h3>

              <p className="text-sm text-muted-foreground">
                {t(dict, 'about.fastShipping.desc')}
              </p>
            </div>

            <div className="p-6 rounded-xl border text-center">
              <h3 className="font-bold mb-2">
                {t(dict, 'about.support')}
              </h3>

              <p className="text-sm text-muted-foreground">
                {t(dict, 'about.support.desc')}
              </p>
            </div>

            <div className="p-6 rounded-xl border text-center">
              <h3 className="font-bold mb-2">
                {t(dict, 'about.guarantee')}
              </h3>

              <p className="text-sm text-muted-foreground">
                {t(dict, 'about.guarantee.desc')}
              </p>
            </div>

          </div>

        </section>


        {/* STATS */}
        <section>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

            <div>
              <h3 className="text-4xl font-bold text-accent">10K+</h3>
              <p className="text-muted-foreground">
                {t(dict, 'about.customers')}
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-accent">500+</h3>
              <p className="text-muted-foreground">
                {t(dict, 'about.products')}
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-accent">50+</h3>
              <p className="text-muted-foreground">
                {t(dict, 'about.brands')}
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-accent">4.9</h3>
              <p className="text-muted-foreground">
                {t(dict, 'about.rating')}
              </p>
            </div>

          </div>

        </section>


        {/* VALUES */}
        <section className="max-w-3xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-6">
            {t(dict, 'about.values')}
          </h2>

          <p className="text-foreground/70 leading-relaxed">
            {t(dict, 'about.p2')}
          </p>

        </section>


        {/* CTA */}
        <section className="text-center">

          <h2 className="text-3xl font-bold mb-8">
            {t(dict, 'about.cta')}
          </h2>

          <div className="flex justify-center gap-4">

            <Button asChild size="lg">
              <Link href="/products">
                {t(dict, 'cta.shopNow')}
              </Link>
            </Button>

            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">
                {t(dict, 'button.contactUs')}
              </Link>
            </Button>

          </div>

        </section>

      </div>

    </div>
  )
}
