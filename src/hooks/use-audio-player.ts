import { useState, useEffect, useRef } from "react";
import { RadioStation } from "@/types/radio";
import { toast } from "sonner";

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem("radioVolume");
    return savedVolume ? parseFloat(savedVolume) : 0.8; // Default to 80%
  });
  const [isMuted, setIsMuted] = useState(() => {
    const savedMuted = localStorage.getItem("radioMuted");
    return savedMuted ? savedMuted === "true" : false;
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousVolumeRef = useRef(volume);

  useEffect(() => {
    audioRef.current = new Audio();

    // Set initial volume
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Save volume and muted state to localStorage when they change
  useEffect(() => {
    localStorage.setItem("radioVolume", volume.toString());
    if (audioRef.current && !isMuted) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    localStorage.setItem("radioMuted", isMuted.toString());
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);

  const playStation = async (station: RadioStation) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = station.url_resolved;
        audioRef.current.volume = isMuted ? 0 : volume;
        audioRef.current.play();
        setIsPlaying(true);
        setCurrentStation(station);
        toast.success(`Now playing: ${station.name}`);
      }
    } catch (error) {
      toast.error("Failed to play station");
      console.error("Error playing station:", error);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else if (currentStation) {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      // Unmute: restore previous volume
      setIsMuted(false);
    } else {
      // Mute: save current volume and set to 0
      previousVolumeRef.current = volume;
      setIsMuted(true);
    }
  };

  return {
    isPlaying,
    currentStation,
    volume,
    isMuted,
    playStation,
    togglePlay,
    changeVolume,
    toggleMute,
  };
};