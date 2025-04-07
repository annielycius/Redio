import { RadioStation } from "@/types/radio";
import { cn } from "@/lib/utils";
import { PauseIcon, PlayIcon, Music2Icon, XIcon, Volume2, VolumeX, Volume1, ChevronUp, ChevronDown, Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface NowPlayingProps {
  station: RadioStation | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  onPlayPause: () => void;
  onVolumeChange: (value: number) => void;
  onToggleMute: () => void;
}

export const NowPlaying = ({
  station,
  isPlaying,
  volume,
  isMuted,
  onPlayPause,
  onVolumeChange,
  onToggleMute,
}: NowPlayingProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Update remaining time
  useEffect(() => {
    if (sleepTimer && remainingTime !== null) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev === null || prev <= 0) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            onPlayPause(); // Stop playback when timer ends
            setSleepTimer(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [sleepTimer, remainingTime, onPlayPause]);

  const setSleepTimerMinutes = (minutes: number) => {
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (minutes > 0) {
      setSleepTimer(minutes);
      setRemainingTime(minutes * 60);
    } else {
      setSleepTimer(null);
      setRemainingTime(null);
    }
  };

  const formatTime = (seconds: number | null): string => {
    if (seconds === null) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="w-5 h-5" />;
    if (volume < 0.5) return <Volume1 className="w-5 h-5" />;
    return <Volume2 className="w-5 h-5" />;
  };

  if (!station || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-white/10 z-50 transition-all duration-300"
      style={{ height: isExpanded ? "auto" : "auto" }}
    >
      <div className="absolute top-0 left-0 right-0 flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-t-none rounded-b-lg bg-card/80 border-t-0 border border-white/10"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {station.favicon ? (
            <img
              src={station.favicon}
              alt={station.name}
              className="w-16 h-16 rounded-lg object-cover shadow-md"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center shadow-md">
              <Music2Icon className="w-8 h-8 text-primary" />
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            <h3 className="font-semibold text-xl text-white truncate">{station.name}</h3>
            <p className="text-sm text-muted truncate">
              {station.tags.split(",")[0]} • {station.bitrate}kbps
            </p>
            {remainingTime !== null && (
              <div className="flex items-center gap-1 text-xs text-primary">
                <Clock className="w-3 h-3" />
                <span>Sleep timer: {formatTime(remainingTime)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Volume Control */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/80 hover:text-primary hover:bg-white/5"
                onClick={onToggleMute}
              >
                {getVolumeIcon()}
              </Button>
              <Slider
                className="w-24"
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.01}
                onValueChange={(value) => onVolumeChange(value[0])}
              />
            </div>

            {/* Mobile Volume Button */}
            <div className="md:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/80 hover:text-primary hover:bg-white/5"
                  >
                    {getVolumeIcon()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 bg-card/95 backdrop-blur-md border-white/10">
                  <div className="flex flex-col gap-2">
                    <Slider
                      className="w-32"
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.01}
                      onValueChange={(value) => onVolumeChange(value[0])}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/80 hover:text-primary"
                      onClick={onToggleMute}
                    >
                      {isMuted ? "Unmute" : "Mute"}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Sleep Timer */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/80 hover:text-primary hover:bg-white/5"
                >
                  <Clock className="w-5 h-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3 bg-card/95 backdrop-blur-md border-white/10">
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-white/80 mb-2">Sleep Timer</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSleepTimerMinutes(5)}
                      className={cn(sleepTimer === 5 && "bg-primary/20 border-primary")}
                    >
                      5 min
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSleepTimerMinutes(15)}
                      className={cn(sleepTimer === 15 && "bg-primary/20 border-primary")}
                    >
                      15 min
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSleepTimerMinutes(30)}
                      className={cn(sleepTimer === 30 && "bg-primary/20 border-primary")}
                    >
                      30 min
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSleepTimerMinutes(60)}
                      className={cn(sleepTimer === 60 && "bg-primary/20 border-primary")}
                    >
                      1 hour
                    </Button>
                  </div>
                  {sleepTimer && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSleepTimerMinutes(0)}
                      className="mt-2 text-destructive hover:text-destructive/80"
                    >
                      Cancel Timer
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Play/Pause Button */}
            <Button
              onClick={onPlayPause}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                "bg-primary hover:bg-primary/80 transition-colors",
                "active:scale-95"
              )}
            >
              {isPlaying ? (
                <PauseIcon className="w-6 h-6 text-white" />
              ) : (
                <PlayIcon className="w-6 h-6 text-white animate-bounce" />
              )}
            </Button>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVisible(false)}
              className="text-white/60 hover:text-white hover:bg-white/5"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Station Info</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-white/70"><span className="text-white/40">Country:</span> {station.country}</p>
                  <p className="text-white/70"><span className="text-white/40">Language:</span> {station.language || "Not specified"}</p>
                  <p className="text-white/70"><span className="text-white/40">Codec:</span> {station.codec}</p>
                  <p className="text-white/70"><span className="text-white/40">Bitrate:</span> {station.bitrate}kbps</p>
                  {station.homepage && (
                    <p className="text-white/70">
                      <span className="text-white/40">Website:</span>{" "}
                      <a
                        href={station.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit
                      </a>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {station.tags.split(",").map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};