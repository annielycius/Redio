import { RadioStation } from "@/types/radio";
import { useState, useEffect } from "react";
import { useVoiceControl } from "@/hooks/use-voice-control";
import { useFavorites } from "@/hooks/use-favorites";
import { SearchBar } from "./radio/SearchBar";
import { StationCard } from "./radio/StationCard";
import { PaginationControls } from "./radio/PaginationControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Heart, Radio, Mic, Music, Headphones } from "lucide-react";

interface StationListProps {
  stations: RadioStation[];
  onStationClick: (station: RadioStation) => void;
  currentStation: RadioStation | null;
  isLoading: boolean;
}

type SortOption = "default" | "name" | "listeners" | "bitrate";

export const StationList = ({
  stations,
  onStationClick,
  currentStation,
  isLoading,
}: StationListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const itemsPerPage = 9;

  // Reset to page 1 when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const { startListening, stopListening, listening } = useVoiceControl(
    (station) => {
      const found = stations.find((s) =>
        s.name.toLowerCase().includes(station.toLowerCase())
      );
      if (found) onStationClick(found);
    },
    () => {
      // Handle stop command
    },
    handleSearch
  );

  // Filter stations based on search query
  const filteredStations = stations.filter((station) =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.tags.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (station.language && station.language.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Filter based on active tab
  const tabFilteredStations = activeTab === "favorites"
    ? filteredStations.filter(station => isFavorite(station.stationuuid))
    : filteredStations;

  // Sort stations based on selected option
  const sortedStations = [...tabFilteredStations].sort((a, b) => {
    // Always put favorites at the top if we're on the "all" tab
    if (activeTab === "all") {
      const aIsFavorite = isFavorite(a.stationuuid);
      const bIsFavorite = isFavorite(b.stationuuid);
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
    }

    // Then apply the selected sort option
    switch (sortOption) {
      case "name":
        return a.name.localeCompare(b.name);
      case "listeners":
        return (b.clickcount || 0) - (a.clickcount || 0);
      case "bitrate":
        return b.bitrate - a.bitrate;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedStations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStations = sortedStations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="max-w-md mx-auto h-12 bg-card/50 animate-pulse rounded-full" />
        <div className="flex justify-center mb-4">
          <div className="w-64 h-10 bg-card/50 animate-pulse rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-card/50 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        listening={listening}
        startListening={startListening}
        stopListening={stopListening}
      />

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <TabsList className="bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <Radio className="w-4 h-4" /> All Stations
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-1">
              <Heart className="w-4 h-4" /> Favorites
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">Sort by:</span>
            <div className="flex bg-card/50 backdrop-blur-sm rounded-md">
              <Button
                variant="ghost"
                size="sm"
                className={sortOption === "default" ? "bg-primary/20" : ""}
                onClick={() => setSortOption("default")}
              >
                Default
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={sortOption === "name" ? "bg-primary/20" : ""}
                onClick={() => setSortOption("name")}
              >
                Name
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={sortOption === "listeners" ? "bg-primary/20" : ""}
                onClick={() => setSortOption("listeners")}
              >
                Listeners
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={sortOption === "bitrate" ? "bg-primary/20" : ""}
                onClick={() => setSortOption("bitrate")}
              >
                Quality
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          {filteredStations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-card/50 rounded-lg">
              <Music className="w-12 h-12 text-primary/50 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No stations found</h3>
              <p className="text-white/60 text-center max-w-md">
                No radio stations match your search criteria. Try a different search term or clear the search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {paginatedStations.map((station) => (
                <StationCard
                  key={station.stationuuid}
                  station={station}
                  isPinned={isFavorite(station.stationuuid)}
                  isCurrentStation={currentStation?.stationuuid === station.stationuuid}
                  onPinToggle={(id) => toggleFavorite(id, station.name)}
                  onStationClick={onStationClick}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-0">
          {tabFilteredStations.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-card/50 rounded-lg">
              <Heart className="w-12 h-12 text-primary/50 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No favorites yet</h3>
              <p className="text-white/60 text-center max-w-md">
                You haven't added any stations to your favorites yet. Click the pin icon on a station card to add it to your favorites.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {paginatedStations.map((station) => (
                <StationCard
                  key={station.stationuuid}
                  station={station}
                  isPinned={isFavorite(station.stationuuid)}
                  isCurrentStation={currentStation?.stationuuid === station.stationuuid}
                  onPinToggle={(id) => toggleFavorite(id, station.name)}
                  onStationClick={onStationClick}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <div className="flex justify-center">
        <p className="text-sm text-white/40">
          Showing {paginatedStations.length} of {sortedStations.length} stations
        </p>
      </div>
    </div>
  );
};