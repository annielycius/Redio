import { renderHook, waitFor } from "@testing-library/react";
import { useRadioStations } from "./use-radio-stations";
import { mockStations } from "@/api/mockData";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";

// Mock the fetch function
global.fetch = vi.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useRadioStations", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return a list of radio stations on successful fetch", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockStations),
    });

    const { result } = renderHook(() => useRadioStations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockStations);
  });

  it("should return fallback data when all API endpoints fail", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: "Not Found",
    });

    const { result } = renderHook(() => useRadioStations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockStations);
  });
});
