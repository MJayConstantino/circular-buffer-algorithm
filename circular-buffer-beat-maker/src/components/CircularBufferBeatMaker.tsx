"use client";

import React, { FC, useState } from "react";
import { ControlPanel } from "./ControlPanel";
import { RecordingsList } from "./RecordingsList";
import { useAudio } from "../hooks/useAudio";

export const CircularBufferBeatMaker: FC = () => {
  const [bufferSize, setBufferSize] = useState<number>(4);
  const [tempo, setTempo] = useState<number>(120);

  const {
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
  } = useAudio(bufferSize, tempo);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Circular Buffer Beat Maker
        </h1>
        <p className="text-gray-400 text-center">
          Record audio samples and loop them to create beats
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ControlPanel
          bufferSize={bufferSize}
          setBufferSize={setBufferSize}
          tempo={tempo}
          setTempo={setTempo}
          isRecording={isRecording}
          startRecording={startRecording}
          playing={playing}
          togglePlayback={togglePlayback}
          clearRecordings={clearRecordings}
          recordingsCount={recordings.length}
        />

        <RecordingsList
          recordings={recordings}
          bufferSize={bufferSize}
          currentBeat={currentBeat}
          playSample={playSample}
          removeRecording={removeRecording}
        />
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>Circular Buffer Beat Maker - Made with Next.js and TypeScript</p>
      </footer>
    </div>
  );
};
