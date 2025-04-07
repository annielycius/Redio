import { useState, useEffect } from 'react';
import { RadioStation } from '@/types/radio';
import { toast } from 'sonner';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favoriteStations');
    return saved ? JSON.parse(saved) : [];
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favoriteStations', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (stationId: string, stationName?: string) => {
    setFavorites((prev) => {
      if (prev.includes(stationId)) return prev;
      toast.success(stationName ? `Added ${stationName} to favorites` : 'Added to favorites');
      return [...prev, stationId];
    });
  };

  const removeFavorite = (stationId: string, stationName?: string) => {
    setFavorites((prev) => {
      if (!prev.includes(stationId)) return prev;
      toast.success(stationName ? `Removed ${stationName} from favorites` : 'Removed from favorites');
      return prev.filter((id) => id !== stationId);
    });
  };

  const toggleFavorite = (stationId: string, stationName?: string) => {
    if (favorites.includes(stationId)) {
      removeFavorite(stationId, stationName);
    } else {
      addFavorite(stationId, stationName);
    }
  };

  const isFavorite = (stationId: string): boolean => {
    return favorites.includes(stationId);
  };

  const getFavoriteStations = (stations: RadioStation[]): RadioStation[] => {
    return stations.filter((station) => favorites.includes(station.stationuuid));
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    getFavoriteStations,
  };
};
