import CustomCursor from "./components/CustomCursor"
import FashionSidebar from "./components/FashionSidebar"
import GrainOverlay from "./components/GrainOverlay"
import Loader from "./components/Loader"
import MarketToast from "./components/MarketToast"
import Navigation from "./components/Navigation"
import NightModeToggle from "./components/NightModeToggle"
import PassportDock from "./components/PassportDock"
import PaymentModal from "./components/PaymentModal"
import { SmoothScroll } from "./components/SmoothScroll"
import VendorSidebar from "./components/VendorSidebar"
import { ExperienceProvider, useExperience } from "./context/ExperienceContext"
import ArcadeGame from "./sections/ArcadeGame"
import ArtSection from "./sections/ArtSection"
import CategoryGallery from "./sections/CategoryGallery"
import FashionSection from "./sections/FashionSection"
import FinalCTA from "./sections/FinalCTA"
import FoodSection from "./sections/FoodSection"
import Footer from "./sections/Footer"
import Hero from "./sections/Hero"
import MapSection from "./sections/MapSection"
import MarketIntro from "./sections/MarketIntro"
import MusicSection from "./sections/MusicSection"
import PassportSection from "./sections/PassportSection"
import Schedule from "./sections/Schedule"
import TicketSection from "./sections/TicketSection"
import VendorSection from "./sections/VendorSection"
import "./styles/experience.css"

function ExperienceModals() {
  const {
    activeVendorDrawer,
    setActiveVendorDrawer,
    activeFashionDrawer,
    setActiveFashionDrawer,
    activePassPayment,
    setActivePassPayment,
    unlockStamp,
    setMarketToast,
  } = useExperience()

  const handlePaymentSuccess = (pass, bookingRef) => {
    setActivePassPayment(null)
    unlockStamp("foodie")
    setMarketToast({
      title: "PASS CONFIRMED!",
      message: `${pass.name} (${bookingRef}) is active. See you at the Night Market!`,
    })
    const visitEl = document.getElementById("visit") || document.getElementById("hero")
    if (visitEl) {
      visitEl.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <>
      <VendorSidebar
        vendor={activeVendorDrawer}
        onClose={() => setActiveVendorDrawer(null)}
      />
      <FashionSidebar
        fashion={activeFashionDrawer}
        onClose={() => setActiveFashionDrawer(null)}
      />
      <PaymentModal
        pass={activePassPayment}
        onClose={() => setActivePassPayment(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />
      <MarketToast />
    </>
  )
}

export default function App() {
  return (
    <ExperienceProvider>
      <Loader />
      <SmoothScroll>
        <div className="app-shell">
          <Navigation />
          <main>
            <Hero />
            <MarketIntro />
            <CategoryGallery />
            <FoodSection />
            <FashionSection />
            <ArtSection />
            <MusicSection />
            <VendorSection />
            <PassportSection />
            <ArcadeGame />
            <Schedule />
            <TicketSection />
            <MapSection />
            <FinalCTA />
          </main>
          <Footer />
          <NightModeToggle />
          <PassportDock />
          <ExperienceModals />
        </div>
        <CustomCursor />
        <GrainOverlay />
      </SmoothScroll>
    </ExperienceProvider>
  )
}
