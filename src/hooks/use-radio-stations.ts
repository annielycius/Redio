import { useQuery } from "@tanstack/react-query";
import { RadioStation } from "@/types/radio";
import { mockStations } from "@/api/mockData";

const fetchRadioStations = async (): Promise<RadioStation[]> => {
  // Uncomment this code when you want to use the real API
import { toast } from "sonner";

const API_ENDPOINTS = [
  "https://de1.api.radio-browser.info/json/stations/bycountry/Tanzania",
  "https://fr1.api.radio-browser.info/json/stations/bycountry/Tanzania",
  "https://nl1.api.radio-browser.info/json/stations/bycountry/Tanzania",
];

const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(url, { ...options, signal: controller.signal });
  clearTimeout(id);
  return response;
};

const fetchRadioStations = async (): Promise<RadioStation[]> => {
  let lastError: Error | null = null;

  for (const endpoint of API_ENDPOINTS) {
    try {
      const response = await fetchWithTimeout(
        endpoint,
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "BongoRedio/2.0",
          },
        },
        5000 // 5-second timeout
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch from ${endpoint}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data) && data.length > 0) {
        console.log(`Successfully fetched ${data.length} stations from ${endpoint}`);
        // Filter out stations with no audio stream URL
        return data.filter(station => station.url_resolved);
      }
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  // If all endpoints fail, show a toast and return fallback data
  console.warn("All API endpoints failed, using fallback data");
  toast.error("Could not connect to the radio stations API. Using fallback data.");
  return mockStations;
};

};

export const useRadioStations = () => {
  return useQuery({
    queryKey: ["radio-stations"],
    queryFn: fetchRadioStations,
    retry: 3, // Retry failed requests 3 times
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
};