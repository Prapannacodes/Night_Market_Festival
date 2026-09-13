import CustomCursor from "./components/CustomCursor"
import GrainOverlay from "./components/GrainOverlay"
import Loader from "./components/Loader"
import Navigation from "./components/Navigation"
import NightModeToggle from "./components/NightModeToggle"
import PassportDock from "./components/PassportDock"
import { SmoothScroll } from "./components/SmoothScroll"
import { ExperienceProvider } from "./context/ExperienceContext"
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
        </div>
        <CustomCursor />
        <GrainOverlay />
      </SmoothScroll>
    </ExperienceProvider>
  )
}
