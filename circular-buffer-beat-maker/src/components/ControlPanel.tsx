import React, { FC } from "react";

interface ControlPanelProps {
  bufferSize: number;
  setBufferSize: (size: number) => void;
  tempo: number;
  setTempo: (tempo: number) => void;
  isRecording: boolean;
  startRecording: () => void;
  playing: boolean;
  togglePlayback: () => void;
  clearRecordings: () => void;
  recordingsCount: number;
}

export const ControlPanel: FC<ControlPanelProps> = ({
  bufferSize,
  setBufferSize,
  tempo,
  setTempo,
  isRecording,
  startRecording,
  playing,
  togglePlayback,
  clearRecordings,
  recordingsCount,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Controls</h2>

      <div className="mb-6">
        <label className="block mb-2">Buffer Size:</label>
        <div className="flex items-center">
          <input
            type="range"
            min="1"
            max="8"
            value={bufferSize}
            onChange={(e) => setBufferSize(parseInt(e.target.value))}
            className="w-full mr-4"
          />
          <span className="text-lg font-medium">{bufferSize}</span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block mb-2">Tempo (BPM):</label>
        <div className="flex items-center">
          <input
            type="range"
            min="60"
            max="200"
            value={tempo}
            onChange={(e) => setTempo(parseInt(e.target.value))}
            className="w-full mr-4"
          />
          <span className="text-lg font-medium">{tempo} BPM</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className={`px-4 py-2 rounded-lg font-medium flex items-center justify-center ${
            isRecording
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
        >
          {isRecording ? "Recording..." : "Record Sample"}
        </button>

        <button
          onClick={togglePlayback}
          disabled={recordingsCount === 0}
          className={`px-4 py-2 rounded-lg font-medium flex items-center justify-center ${
            recordingsCount === 0
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : playing
              ? "bg-yellow-600 hover:bg-yellow-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {playing ? "Stop Playback" : "Play Loop"}
        </button>

        <button
          onClick={clearRecordings}
          disabled={recordingsCount === 0}
          className={`px-4 py-2 rounded-lg font-medium ${
            recordingsCount === 0
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Clear All
        </button>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg">
        <h3 className="font-medium mb-2">How It Works:</h3>
        <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm">
          <li>Record short audio samples (2 seconds each)</li>
          <li>
            Samples are stored in a circular buffer (newest replace oldest when
            full)
          </li>
          <li>Press Play to loop through your samples at the selected tempo</li>
          <li>Click on individual samples to preview them</li>
          <li>Remove samples you don't want</li>
        </ul>
      </div>
    </div>
  );
};
