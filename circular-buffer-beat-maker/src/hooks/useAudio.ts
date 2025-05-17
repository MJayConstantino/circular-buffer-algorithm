import { useState, useEffect, useRef } from "react";
import { Recording } from "@/types/recording.type";

export const useAudio = (bufferSize: number, tempo: number) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [playing, setPlaying] = useState<boolean>(false);
  const [currentBeat, setCurrentBeat] = useState<number>(-1);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBuffersRef = useRef<AudioBuffer[]>([]);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext ||
      window.AudioContext)();
    return () => {
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Calculate beat duration based on tempo (BPM)
  const getBeatDuration = (): number => {
    return (60 / tempo) * 1000; // Convert BPM to milliseconds
  };

  // Start recording function
  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Add to circular buffer (replace oldest if full)
        const newRecordings = [...recordings];
        if (newRecordings.length >= bufferSize) {
          newRecordings.shift(); // Remove oldest recording
        }

        // Create audio buffer for playback
        if (audioContextRef.current) {
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioBuffer = await audioContextRef.current.decodeAudioData(
            arrayBuffer
          );

          // Store in our audio buffers array
          if (audioBuffersRef.current.length >= bufferSize) {
            audioBuffersRef.current.shift();
          }
          audioBuffersRef.current.push(audioBuffer);

          // Add to UI list with timestamp
          newRecordings.push({
            url: audioUrl,
            timestamp: new Date().toLocaleTimeString(),
            id: Date.now(),
          });

          setRecordings(newRecordings);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Auto-stop after 2 seconds to create beat-sized chunks
      setTimeout(() => {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state === "recording"
        ) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 2000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check your permissions.");
    }
  };

  // Stop recording function
  const stopRecording = (): void => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Play a specific beat sample
  const playSample = (index: number): void => {
    if (!audioBuffersRef.current[index] || !audioContextRef.current) return;

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffersRef.current[index];
    source.connect(audioContextRef.current.destination);
    source.start();
  };

  // Remove a recording
  const removeRecording = (id: number): void => {
    const index = recordings.findIndex((rec) => rec.id === id);
    if (index > -1) {
      const newRecordings = [...recordings];
      newRecordings.splice(index, 1);
      setRecordings(newRecordings);

      // Also remove from audio buffers
      const newBuffers = [...audioBuffersRef.current];
      newBuffers.splice(index, 1);
      audioBuffersRef.current = newBuffers;
    }
  };

  // Toggle playback loop
  const togglePlayback = (): void => {
    if (playing) {
      // Stop playback
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
      setPlaying(false);
      setCurrentBeat(-1);
    } else {
      // Start playback loop
      if (audioBuffersRef.current.length > 0) {
        setPlaying(true);
        let beatIndex = 0;

        // Play first beat immediately
        playSample(beatIndex);
        setCurrentBeat(beatIndex);

        // Set up interval for remaining beats
        playbackIntervalRef.current = setInterval(() => {
          beatIndex = (beatIndex + 1) % audioBuffersRef.current.length;
          playSample(beatIndex);
          setCurrentBeat(beatIndex);
        }, getBeatDuration());
      }
    }
  };

  // Clear all recordings
  const clearRecordings = (): void => {
    setRecordings([]);
    audioBuffersRef.current = [];
    if (playing) {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
      setPlaying(false);
      setCurrentBeat(-1);
    }
  };

  // Update interval when tempo changes
  useEffect(() => {
    if (playing) {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }

      playbackIntervalRef.current = setInterval(() => {
        setCurrentBeat((prevBeat) => {
          const nextBeat = (prevBeat + 1) % audioBuffersRef.current.length;
          playSample(nextBeat);
          return nextBeat;
        });
      }, getBeatDuration());
    }

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [tempo, playing]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
      recordings.forEach((recording) => {
        URL.revokeObjectURL(recording.url);
      });
    };
  }, [recordings]);

  return {
    isRecording,
    recordings,
    playing,
    currentBeat,
    startRecording,
    stopRecording,
    playSample,
    removeRecording,
    togglePlayback,
    clearRecordings,
  };
};
