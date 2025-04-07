import { useQuery } from "@tanstack/react-query";
import { RadioStation } from "@/types/radio";
import { mockStations } from "@/api/mockData";

const fetchRadioStations = async (): Promise<RadioStation[]> => {
  // For development, just return mock data immediately
  // This ensures we always have data to work with
  console.log("Using mock data for radio stations");
  return mockStations;

  /* Uncomment this code when you want to use the real API
  try {
    // Try multiple API endpoints in case one fails
    const endpoints = [
      "https://de1.api.radio-browser.info/json/stations/bycountry/Tanzania",
      "https://fr1.api.radio-browser.info/json/stations/bycountry/Tanzania",
      "https://nl1.api.radio-browser.info/json/stations/bycountry/Tanzania"
    ];

    let lastError: Error | null = null;

    // Try each endpoint until one succeeds
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "BongoRedio/2.0", // Updated user agent
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch from ${endpoint}: ${response.statusText}`);
        }

        const data = await response.json();

        // If we got data, return it
        if (data && Array.isArray(data) && data.length > 0) {
          console.log(`Successfully fetched ${data.length} stations from ${endpoint}`);
          return data;
        }
      } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error);
        lastError = error instanceof Error ? error : new Error(String(error));
        // Continue to the next endpoint
      }
    }

    // If we get here, all endpoints failed
    console.warn("All API endpoints failed, using fallback data");
    toast.error("Could not connect to radio stations API. Using fallback data.");

    // Return fallback data
    return mockStations;
  } catch (error) {
    console.error("Error in fetchRadioStations:", error);
    toast.error("Failed to load radio stations. Using fallback data.");
    return mockStations;
  }
  */
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