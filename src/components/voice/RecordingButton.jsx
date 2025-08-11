import { Button } from '@/components/ui/button.jsx'
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid'

export function RecordingButton({ 
  isRecording, 
  isProcessing, 
  standbyMode, 
  recordTime, 
  onStart, 
  onStop 
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (isProcessing) {
    return (
      <Button 
        size="lg" 
        className="w-32 h-32 rounded-full bg-gray-500 hover:bg-gray-600 text-white"
        disabled
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
          <span className="text-xs">Processing...</span>
        </div>
      </Button>
    )
  }

  if (standbyMode) {
    return (
      <Button 
        size="lg" 
        className="w-32 h-32 rounded-full bg-orange-500 hover:bg-orange-600 text-white animate-pulse"
        onClick={onStart}
      >
        <div className="flex flex-col items-center">
          <MicrophoneIcon className="h-8 w-8 mb-2" />
          <span className="text-xs">Tap to Continue</span>
        </div>
      </Button>
    )
  }

  return (
    <Button 
      size="lg" 
      className={`w-32 h-32 rounded-full text-white transition-all duration-200 ${
        isRecording 
          ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/50' 
          : 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/50'
      }`}
      onClick={isRecording ? onStop : onStart}
    >
      <div className="flex flex-col items-center">
        {isRecording ? (
          <>
            <StopIcon className="h-8 w-8 mb-2" />
            <span className="text-xs font-mono">{formatTime(recordTime)}</span>
          </>
        ) : (
          <>
            <MicrophoneIcon className="h-8 w-8 mb-2" />
            <span className="text-xs">Start Recording</span>
          </>
        )}
      </div>
    </Button>
  )
}

