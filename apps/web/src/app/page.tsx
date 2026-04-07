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
    country: "France",
    imageUrl:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=80",
    availabilityLabel: "247 hotels available",
    priceLabel: "$89",
  },
  {
    id: "santorini",
    href: "/destinations",
    city: "Santorini",
    country: "Greece",
    imageUrl:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
    availabilityLabel: "184 hotels available",
    priceLabel: "$124",
  },
  {
    id: "maldives",
    href: "/destinations",
    city: "Maldives",
    country: "Brazil",
    imageUrl:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=80",
    availabilityLabel: "96 resorts available",
    priceLabel: "$290",
  },
  {
    id: "tokyo",
    href: "/destinations",
    city: "Tokyo",
    country: "Japan",
    imageUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80",
    availabilityLabel: "412 hotels available",
    priceLabel: "$72",
  },
];

const fallbackRecommendedHotels: HomeRecommendedHotel[] = [
  {
    id: "grand-palace",
    href: "/destinations",
    name: "Grand Palace Resort & Spa",
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    badge: "Featured",
    badgeTone: "gold",
    rating: "4.9",
    reviews: "312",
    location: "Santorini, Greece",
    amenities: ["Pool", "Breakfast", "WiFi"],
    priceLabel: "$248",
  },
  {
    id: "maison-elegante",
    href: "/destinations",
    name: "Maison Elegante Paris",
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    badge: "Best Value",
    badgeTone: "success",
    rating: "4.7",
    reviews: "189",
    location: "Paris, France",
    amenities: ["Concierge", "Restaurant", "Gym"],
    priceLabel: "$156",
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
    location: "North Male Atoll, Maldives",
    amenities: ["Diving", "Boat", "Spa"],
    priceLabel: "$540",
  },
];

const destinationRateFallback = ["$89", "$124", "$290", "$72"];
const hotelBadgeFallback = [
  { label: "Featured", tone: "gold" as const },
  { label: "Best Value", tone: "success" as const },
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
        className="scroll-mt-28 px-5 py-20 md:px-8 xl:px-[120px]"
      >
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10">
          <HomeSectionHeader
            eyebrow="EXPLORE THE WORLD"
            title="Featured destinations"
            linkLabel="View all destinations ->"
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
        className="scroll-mt-28 px-5 pb-20 md:px-8 xl:px-[120px]"
      >
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10">
          <HomeSectionHeader
            eyebrow="HANDPICKED FOR YOU"
            title="Recommended hotels"
            linkLabel="View all hotels ->"
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
          availabilityLabel: `${detail.hotels.length || index + 1} hotel${detail.hotels.length === 1 ? "" : "s"} available`,
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
          availabilityLabel: `${120 + index * 37} hotels available`,
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
          priceLabel: startingRate ? formatUsdLike(startingRate) : fallbackRecommendedHotels[index]?.priceLabel || "$180",
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
          priceLabel: fallbackRecommendedHotels[index]?.priceLabel || "$180",
        } satisfies HomeRecommendedHotel;
      }
    }),
  );

  return details;
}

function formatUsdLike(value: number): string {
  return `$${Math.round(value)}`;
}