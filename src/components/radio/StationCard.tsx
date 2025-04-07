import { RadioStation } from "@/types/radio";
import { cn } from "@/lib/utils";
import { Music2Icon, Radio, Headphones, Globe2, Signal, PinIcon, Users, Play, Pause, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

interface StationCardProps {
  station: RadioStation;
  isPinned: boolean;
  isCurrentStation: boolean;
  onPinToggle: (stationId: string) => void;
  onStationClick: (station: RadioStation) => void;
}

export const StationCard = ({
  station,
  isPinned,
  isCurrentStation,
  onPinToggle,
  onStationClick,
}: StationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Get the first tag for display
  const primaryTag = station.tags.split(",")[0].trim();

  // Format listener count
  const formatListeners = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Card
        className={cn(
          "cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
          "hover:shadow-lg hover:shadow-primary/20",
          "group backdrop-blur-sm bg-card/80 relative overflow-hidden h-full",
          isCurrentStation && "ring-2 ring-primary",
          isPinned && "border-primary"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onStationClick(station)}
      >
        {/* Background decorations */}
        <div className="absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Radio className="w-16 h-16 text-primary animate-float" />
        </div>
        <div className="absolute -left-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Headphones className="w-16 h-16 text-accent animate-float" style={{ animationDelay: "1s" }} />
        </div>

        {/* Play overlay on hover */}
        {isHovered && !isCurrentStation && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 animate-fade-in">
            <div className="bg-primary/90 rounded-full p-3">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
        )}

        {/* Now playing overlay */}
        {isCurrentStation && (
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="default" className="bg-primary text-white animate-pulse-slow">
              Now Playing
            </Badge>
          </div>
        )}

        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex items-start gap-4">
            {/* Station logo */}
            <div className="relative">
              {station.favicon ? (
                <img
                  src={station.favicon}
                  alt={station.name}
                  className="w-16 h-16 rounded-md object-cover transition-transform duration-300 group-hover:scale-110 shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-md bg-primary/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md">
                  <Radio className="w-8 h-8 text-primary" />
                </div>
              )}

              {/* Pin button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 bg-card/80 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPinToggle(station.stationuuid);
                    }}
                  >
                    <PinIcon
                      className={cn(
                        "h-4 w-4",
                        isPinned ? "text-primary fill-primary" : "text-muted"
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isPinned ? "Unpin station" : "Pin station"}
                </TooltipContent>
              </Tooltip>

              {/* Now playing indicator */}
              {isCurrentStation && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4">
                  <div className="absolute w-full h-full bg-primary rounded-full animate-ping" />
                  <div className="absolute w-full h-full bg-primary rounded-full" />
                </div>
              )}
            </div>

            {/* Station info */}
            <div className="flex flex-col items-start flex-1">
              <h3 className="font-semibold text-lg text-white line-clamp-1 transition-colors duration-300 group-hover:text-primary">
                {station.name}
              </h3>

              {/* Primary tag badge */}
              {primaryTag && (
                <Badge variant="outline" className="mt-1 text-xs bg-primary/10 hover:bg-primary/20 border-primary/20">
                  {primaryTag}
                </Badge>
              )}

              <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 w-full">
                <p className="text-xs text-white/60 flex items-center gap-1">
                  <Signal className="w-3 h-3 text-primary/80" /> {station.bitrate}kbps
                </p>
                <p className="text-xs text-white/60 flex items-center gap-1">
                  <Users className="w-3 h-3 text-primary/80" /> {formatListeners(station.clickcount || 0)}
                </p>
                {station.language && (
                  <p className="text-xs text-white/60 flex items-center gap-1 col-span-2 truncate">
                    <Globe2 className="w-3 h-3 flex-shrink-0 text-primary/80" /> {station.language}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-3 pt-0 flex justify-between items-center">
          <div className="flex gap-1 flex-wrap">
            {station.tags.split(",").slice(0, 2).map((tag, index) => (
              tag.trim() && (
                <span
                  key={index}
                  className="px-1.5 py-0.5 bg-primary/5 text-white/60 text-[10px] rounded-sm"
                >
                  {tag.trim()}
                </span>
              )
            ))}
          </div>

          {station.homepage && (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={station.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white/40 hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                Visit station website
              </TooltipContent>
            </Tooltip>
          )}
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};