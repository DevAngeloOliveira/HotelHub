import {
  FeaturedDestinationCard,
  HomeCallToAction,
  HomeHero,
  HomeSectionHeader,
  RecommendedHotelCard,
  TestimonialsSection,
  WhyHotelHubSection,
  type HomeFeaturedDestination,
  type HomeRecommendedHotel,
} from "@/components/homepage";
import { getDestination, getHotel, listDestinations, listHotels } from "@/lib/api";
import { addDays, toIsoDate } from "@/lib/date-utils";

const fallbackFeaturedDestinations: HomeFeaturedDestination[] = [
  {
    id: "paris",
    href: "/destinations",
    city: "Paris",
    country: "França",
    imageUrl:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80",
    availabilityLabel: "247 hotéis disponíveis",
    priceLabel: "R$ 445",
  },
  {
    id: "santorini",
    href: "/destinations",
    city: "Santorini",
    country: "Grécia",
    imageUrl:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
    availabilityLabel: "184 hotéis disponíveis",
    priceLabel: "R$ 620",
  },
  {
    id: "maldives",
    href: "/destinations",
    city: "Maldivas",
    country: "Maldivas",
    imageUrl:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=80",
    availabilityLabel: "96 resorts disponíveis",
    priceLabel: "R$ 1.450",
  },
  {
    id: "tokyo",
    href: "/destinations",
    city: "Tóquio",
    country: "Japão",
    imageUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
    availabilityLabel: "412 hotéis disponíveis",
    priceLabel: "R$ 360",
  },
];

const fallbackRecommendedHotels: HomeRecommendedHotel[] = [
  {
    id: "grand-palace",
    href: "/destinations",
    name: "Grand Palace Resort & Spa",
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    badge: "Em destaque",
    badgeTone: "gold",
    rating: "4.9",
    reviews: "312",
    location: "Santorini, Grécia",
    amenities: ["Piscina", "Café da manhã", "WiFi"],
    priceLabel: "R$ 1.240",
  },
  {
    id: "maison-elegante",
    href: "/destinations",
    name: "Maison Elegante Paris",
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    badge: "Melhor preço",
    badgeTone: "success",
    rating: "4.7",
    reviews: "189",
    location: "Paris, França",
    amenities: ["Concierge", "Restaurante", "Academia"],
    priceLabel: "R$ 780",
  },
  {
    id: "azure-maldives",
    href: "/destinations",
    name: "Azure Maldives Overwater",
    imageUrl:
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80",
    badge: "Popular",
    badgeTone: "primary",
    rating: "5.0",
    reviews: "94",
    location: "North Male Atoll, Maldivas",
    amenities: ["Mergulho", "Barco", "Spa"],
    priceLabel: "R$ 2.700",
  },
];

const destinationRateFallback = ["R$ 445", "R$ 620", "R$ 1.450", "R$ 360"];
const hotelBadgeFallback = [
  { label: "Em destaque", tone: "gold" as const },
  { label: "Melhor preço", tone: "success" as const },
  { label: "Popular", tone: "primary" as const },
];
const hotelRatingFallback = [
  { rating: "4.9", reviews: "312" },
  { rating: "4.7", reviews: "189" },
  { rating: "5.0", reviews: "94" },
];

export default async function HomePage() {
  const today = new Date();
  const searchDefaults = {
    checkInDate: toIsoDate(addDays(today, 7)),
    checkOutDate: toIsoDate(addDays(today, 10)),
    guestCount: 2,
  };

  const [destinationsResult, hotelsResult] = await Promise.allSettled([
    listDestinations({ size: 4 }),
    listHotels({ size: 3 }),
  ]);

  const featuredDestinations =
    destinationsResult.status === "fulfilled" && destinationsResult.value.content.length > 0
      ? await buildFeaturedDestinations(destinationsResult.value.content)
      : fallbackFeaturedDestinations;

  const recommendedHotels =
    hotelsResult.status === "fulfilled" && hotelsResult.value.content.length > 0
      ? await buildRecommendedHotels(hotelsResult.value.content)
      : fallbackRecommendedHotels;

  return (
    <div className="bg-[#F8F9FB]">
      <HomeHero defaults={searchDefaults} />

      <section
        id="featured-destinations"
        className="scroll-mt-28 px-5 py-20 md:px-8 xl:px-30"
      >
        <div className="mx-auto flex w-full max-w-360 flex-col gap-10">
          <HomeSectionHeader
            eyebrow="EXPLORE O MUNDO"
            title="Destinos em destaque"
            linkLabel="Ver todos os destinos ->"
            linkHref="/destinations"
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredDestinations.map((destination) => (
              <FeaturedDestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="recommended-hotels"
        className="scroll-mt-28 px-5 pb-20 md:px-8 xl:px-30"
      >
        <div className="mx-auto flex w-full max-w-360 flex-col gap-10">
          <HomeSectionHeader
            eyebrow="SELECIONADO PARA VOCÊ"
            title="Hotéis recomendados"
            linkLabel="Ver todos os hotéis ->"
            linkHref="/destinations"
          />

          <div className="grid gap-6 xl:grid-cols-3">
            {recommendedHotels.map((hotel) => (
              <RecommendedHotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      <WhyHotelHubSection />
      <TestimonialsSection />
      <HomeCallToAction />
    </div>
  );
}

async function buildFeaturedDestinations(
  destinations: Awaited<ReturnType<typeof listDestinations>>["content"],
): Promise<HomeFeaturedDestination[]> {
  const details = await Promise.all(
    destinations.slice(0, 4).map(async (destination, index) => {
      try {
        const detail = await getDestination(destination.id);
        return {
          id: detail.id,
          href: `/destinations/${detail.id}`,
          city: detail.city || detail.name,
          country: detail.country,
          imageUrl:
            detail.featuredImageUrl ||
            detail.imageUrl ||
            fallbackFeaturedDestinations[index]?.imageUrl ||
            fallbackFeaturedDestinations[0].imageUrl,
          availabilityLabel: `${detail.hotels.length || index + 1} hotel${detail.hotels.length === 1 ? "" : "s"} disponível${detail.hotels.length === 1 ? "" : "s"}`,
          priceLabel: destinationRateFallback[index] ?? destinationRateFallback[0],
        } satisfies HomeFeaturedDestination;
      } catch {
        return {
          id: destination.id,
          href: `/destinations/${destination.id}`,
          city: destination.city || destination.name,
          country: destination.country,
          imageUrl:
            destination.featuredImageUrl ||
            destination.imageUrl ||
            fallbackFeaturedDestinations[index]?.imageUrl ||
            fallbackFeaturedDestinations[0].imageUrl,
          availabilityLabel: `${120 + index * 37} hotéis disponíveis`,
          priceLabel: destinationRateFallback[index] ?? destinationRateFallback[0],
        } satisfies HomeFeaturedDestination;
      }
    }),
  );

  return details;
}

async function buildRecommendedHotels(
  hotels: Awaited<ReturnType<typeof listHotels>>["content"],
): Promise<HomeRecommendedHotel[]> {
  const details = await Promise.all(
    hotels.slice(0, 3).map(async (hotel, index) => {
      try {
        const detail = await getHotel(hotel.id);
        const startingRate =
          detail.rooms.length > 0
            ? Math.min(...detail.rooms.map((room) => room.pricePerNight))
            : undefined;

        return {
          id: detail.id,
          href: `/hotels/${detail.id}`,
          name: detail.name,
          imageUrl: fallbackRecommendedHotels[index]?.imageUrl || fallbackRecommendedHotels[0].imageUrl,
          badge: hotelBadgeFallback[index]?.label ?? hotelBadgeFallback[0].label,
          badgeTone: hotelBadgeFallback[index]?.tone ?? hotelBadgeFallback[0].tone,
          rating: hotelRatingFallback[index]?.rating ?? "4.8",
          reviews: hotelRatingFallback[index]?.reviews ?? "120",
          location: detail.address,
          amenities: detail.amenities.slice(0, 3),
          priceLabel: startingRate ? formatUsdLike(startingRate) : fallbackRecommendedHotels[index]?.priceLabel || "R$ 900",
        } satisfies HomeRecommendedHotel;
      } catch {
        return {
          id: hotel.id,
          href: `/hotels/${hotel.id}`,
          name: hotel.name,
          imageUrl: fallbackRecommendedHotels[index]?.imageUrl || fallbackRecommendedHotels[0].imageUrl,
          badge: hotelBadgeFallback[index]?.label ?? hotelBadgeFallback[0].label,
          badgeTone: hotelBadgeFallback[index]?.tone ?? hotelBadgeFallback[0].tone,
          rating: hotelRatingFallback[index]?.rating ?? "4.8",
          reviews: hotelRatingFallback[index]?.reviews ?? "120",
          location: hotel.address,
          amenities: hotel.amenities.slice(0, 3),
          priceLabel: fallbackRecommendedHotels[index]?.priceLabel || "R$ 900",
        } satisfies HomeRecommendedHotel;
      }
    }),
  );

  return details;
}

function formatUsdLike(value: number): string {
  return `R$ ${Math.round(value)}`;
}