import { useRadioStations } from "@/hooks/use-radio-stations";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { StationList } from "@/components/StationList";
import { NowPlaying } from "@/components/NowPlaying";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import { toast } from "sonner";

const Index = () => {
  const { data: stations, isLoading, error } = useRadioStations();
  const {
    isPlaying,
    currentStation,
    volume,
    isMuted,
    playStation,
    togglePlay,
    changeVolume,
    toggleMute
  } = useAudioPlayer();

  // Show error toast if there's an error loading stations
  useEffect(() => {
    if (error) {
      console.error("Error loading stations:", error);
      toast.error("There was an error loading radio stations. Using fallback data.");
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white relative overflow-hidden flex flex-col">
      <Helmet>
        <title>{currentStation ? `${currentStation.name} - Bongo Redio` : "Bongo Redio - Stream Tanzanian Radio Stations"}</title>
      </Helmet>

      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full animate-float blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full animate-float blur-3xl" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/5 rounded-full animate-float blur-3xl" style={{ animationDelay: "2s" }} />
      </div>

      <Navbar />

      <main className="flex-1 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center mb-8 animate-fade-in">
            <img src="/logo.svg" alt="Bongo Redio Logo" className="w-24 h-24 mb-4" />
            <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Bongo Redio
            </h1>
            <p className="text-white/70 text-center mt-2 max-w-md">
              Stream the best Tanzanian radio stations with a beautiful, responsive interface
            </p>
          </div>

          <StationList
            stations={stations || []}
            onStationClick={playStation}
            currentStation={currentStation}
            isLoading={isLoading}
          />
        </div>
      </main>

      <Footer />

      {currentStation && (
        <NowPlaying
          station={currentStation}
          isPlaying={isPlaying}
          volume={volume}
          isMuted={isMuted}
          onPlayPause={togglePlay}
          onVolumeChange={changeVolume}
          onToggleMute={toggleMute}
        />
      )}
    </div>
  );
};

export default Index;