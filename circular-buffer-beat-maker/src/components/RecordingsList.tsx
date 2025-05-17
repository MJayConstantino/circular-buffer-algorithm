import React, { FC } from "react";
import { Recording } from "@/types/recording.type";

interface RecordingsListProps {
  recordings: Recording[];
  bufferSize: number;
  currentBeat: number;
  playSample: (index: number) => void;
  removeRecording: (id: number) => void;
}

export const RecordingsList: FC<RecordingsListProps> = ({
  recordings,
  bufferSize,
  currentBeat,
  playSample,
  removeRecording,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        Circular Buffer ({recordings.length}/{bufferSize})
      </h2>

      {recordings.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No recordings yet. Click "Record Sample" to start!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recordings.map((recording, index) => (
            <div
              key={recording.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                currentBeat === index
                  ? "bg-green-900 border border-green-500"
                  : "bg-gray-700"
              }`}
            >
              <div className="flex items-center">
                <span className="font-mono w-6 text-center">{index + 1}</span>
                <button
                  onClick={() => playSample(index)}
                  className="ml-3 w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-500 flex items-center justify-center"
                >
                  ▶
                </button>
                <span className="ml-3 text-sm">{recording.timestamp}</span>
              </div>

              <button
                onClick={() => removeRecording(recording.id)}
                className="text-gray-400 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {recordings.length > 0 && recordings.length < bufferSize && (
        <div className="mt-4 text-sm text-gray-400">
          Buffer space remaining: {bufferSize - recordings.length} slots
        </div>
      )}

      {recordings.length >= bufferSize && (
        <div className="mt-4 text-sm text-yellow-400">
          Buffer full! Next recording will replace the oldest one.
        </div>
      )}
    </div>
  );
};
