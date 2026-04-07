"use client";

import { useState } from "react";
import {
  Button,
  Badge,
  IconButton,
  HotelCard,
  DestinationCard,
  Navbar,
  MobileHeader,
  BottomTabBar,
  TextInput,
  Textarea,
  ToggleSwitch,
  Checkbox,
  SelectDropdown,
  RangeSlider,
  Alert,
  Toast,
  EmptyState,
  Skeleton,
  LoadingState,
} from "@/components";

type ToastType = "success" | "warning" | "error" | "info" | null;

export default function ComponentShowcase() {
  const [toastState, setToastState] = useState<ToastType>(null);
  const [toggleValue, setToggleValue] = useState(true);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [selectValue, setSelectValue] = useState("option1");
  const [rangeMin, setRangeMin] = useState(50);
  const [rangeMax, setRangeMax] = useState(350);
  const [textValue, setTextValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [activeTab, setActiveTab] = useState<"home" | "search" | "bookings" | "saved" | "profile">("home");

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--hh-neutral-900)" }}>
          Component Showcase
        </h1>
        <p className="text-lg mb-12" style={{ color: "var(--hh-neutral-700)" }}>
          All HotelHub design system components
        </p>

        {/* Buttons Section */}
        <section className="mb-16 bg-white p-8 rounded-16px shadow-sm">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--hh-neutral-900)" }}>
            Buttons
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm mb-3 font-medium">Primary</p>
              <div className="space-y-2">
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <Button variant="primary" size="md">
                  Medium
                </Button>
                <Button variant="primary" size="lg">
                  Large
                </Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm mb-3 font-medium">Secondary</p>
              <div className="space-y-2">
                <Button variant="secondary" size="sm">
                  Small
                </Button>
                <Button variant="secondary" size="md">
                  Medium
                </Button>
                <Button variant="secondary" size="lg">
                  Large
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-3 font-medium">Ghost & Accent</p>
              <div className="space-y-2">
                <Button variant="ghost" size="md">
                  Ghost Button
                </Button>
                <Button variant="accentGold" size="md">
                  Accent Gold
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm mb-3 font-medium">Destructive</p>
              <div className="space-y-2">
                <Button variant="destructive" size="md">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section className="mb-16 bg-white p-8 rounded-16px shadow-sm">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--hh-neutral-900)" }}>
            Badges
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {(["info", "success", "warning", "error", "premium", "popular", "fullyBooked", "new"] as const).map(
              (tone) => (
                <Badge key={tone} tone={tone}>
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </Badge>
              )
            )}
          </div>
        </section>

        {/* Forms Section */}
        <section className="mb-16 bg-white p-8 rounded-16px shadow-sm">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--hh-neutral-900)" }}>
            Form Inputs
          </h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <TextInput
                label="Destination"
                placeholder="Enter destination..."
                value={textValue}
                onChange={setTextValue}
                icon="🔍"
              />
              <TextInput
                label="Error State"
                placeholder="This has an error"
                error="This field is required"
              />
              <Textarea
                label="Description"
                placeholder="Enter description..."
                maxLength={200}
                value={textareaValue}
                onChange={setTextareaValue}
                rows={4}
              />
            </div>
            <div className="space-y-6">
              <ToggleSwitch
                label="Free Cancellation"
                checked={toggleValue}
                onChange={setToggleValue}
              />
              <Checkbox
                label="I agree to terms"
                checked={checkboxValue}
                onChange={setCheckboxValue}
              />
              <SelectDropdown
                label="Hotel Type"
                options={[
                  { value: "option1", label: "5-Star Resort" },
                  { value: "option2", label: "Boutique Hotel" },
                  { value: "option3", label: "Budget Hotel" },
                ]}
                value={selectValue}
                onChange={setSelectValue}
              />
              <RangeSlider
                label="Price Range"
                min={0}
                max={500}
                minValue={rangeMin}
                maxValue={rangeMax}
                onMinChange={setRangeMin}
                onMaxChange={setRangeMax}
              />
            </div>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-16 bg-white p-8 rounded-16px shadow-sm">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--hh-neutral-900)" }}>
            Cards
          </h2>
          <div className="grid grid-cols-2 gap-8">
            <HotelCard
              image="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Crect fill='%23e0e7ff' width='220' height='220'/%3E%3C/svg%3E"
              title="Grand Palace Resort & Spa"
              location="Santorini, Greece"
              rating={4.9}
              reviewCount={312}
              price={248}
              badge="featured"
              amenities={["🏊 Pool", "🍳 Breakfast", "📶 WiFi", "💆 Spa"]}
            />
            <HotelCard
              image="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Crect fill='%3Cd1fae5' width='220' height='220'/%3E%3C/svg%3E"
              title="Beach Paradise Hotel"
              location="Maldives"
              rating={4.7}
              reviewCount={256}
              price={180}
              badge="best-value"
              amenities={["🏖️ Beach", "🍹 Bar", "🎱 Games"]}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <DestinationCard name="Santorini" country="Greece" hotelCount={145} />
            <DestinationCard name="Paris" country="France" hotelCount={892} />
            <DestinationCard name="Tokyo" country="Japan" hotelCount={654} />
          </div>
        </section>

        {/* Feedback Section */}
        <section className="mb-16 bg-white p-8 rounded-16px shadow-sm">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--hh-neutral-900)" }}>
            Feedback Components
          </h2>
          <div className="space-y-6">
            <Alert
              tone="success"
              title="Success!"
              description="Your reservation has been confirmed."
            />
            <Alert
              tone="warning"
              title="Limited Availability"
              description="Only 2 rooms left at this price."
            />
            <Alert
              tone="error"
              title="Error"
              description="Something went wrong. Please try again."
            />
            <Alert
              tone="info"
              title="Info"
              description="New hotels added to your preferences."
            />
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">Toast Notifications</p>
              <div className="flex gap-2">
                {(["success", "warning", "error", "info"] as const).map((type) => (
                  <Button
                    key={type}
                    variant="secondary"
                    size="sm"
                    onClick={() => setToastState(type)}
                  >
                    Show {type}
                  </Button>
                ))}
              </div>
            </div>
            {toastState && (
              <Toast
                title="Toast Notification"
                description={`This is a ${toastState} toast message.`}
                onClose={() => setToastState(null)}
              />
            )}
          </div>

          <div className="mt-8">
            <p className="text-sm font-medium mb-3">Empty State</p>
            <EmptyState
              title="No Results Found"
              description="Try adjusting your search filters"
              action={{ label: "Clear Filters", onClick: () => { /* demo */ } }}
            />
          </div>

          <div className="mt-8">
            <p className="text-sm font-medium mb-3">Skeleton Loaders</p>
            <div className="space-y-4">
              <Skeleton type="card" width="100%" height="220px" />
              <Skeleton type="text" width="80%" height="20px" />
              <Skeleton type="button" width="120px" height="44px" />
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-medium mb-3">Loading State</p>
            <LoadingState message="Loading hotels..." />
          </div>
        </section>

        {/* Navigation Section */}
        <section className="mb-16 bg-white p-8 rounded-16px shadow-sm">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--hh-neutral-900)" }}>
            Navigation
          </h2>
          <div className="mb-8 border rounded-12px overflow-hidden">
            <Navbar activeItem="hotels" />
          </div>

          <div className="mb-8 border rounded-12px overflow-hidden bg-linear-to-b from-primary-700 to-primary-900 h-24">
            <MobileHeader title="Good morning, Ana 👋" location="📍 São Paulo, Brazil" userInitial="A" />
          </div>

          <div className="border rounded-12px overflow-hidden">
            <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} notificationCount={3} />
          </div>
        </section>

        {/* Icon Buttons Section */}
        <section className="bg-white p-8 rounded-16px shadow-sm">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--hh-neutral-900)" }}>
            Icon Buttons
          </h2>
          <div className="flex gap-4">
            <IconButton icon="🔍" variant="default" />
            <IconButton icon="❤️" variant="filled" />
            <IconButton icon="🗑️" variant="error" />
          </div>
        </section>
      </div>
    </div>
  );
}
