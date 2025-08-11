import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { ClipboardDocumentIcon } from '@heroicons/react/24/solid'

export function TranscriptionCard({ transcription, onCopy }) {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcription.text)
      onCopy && onCopy('Text copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = transcription.text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      onCopy && onCopy('Text copied to clipboard!')
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-muted-foreground">
            {formatTime(transcription.timestamp)}
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center gap-2"
          >
            <ClipboardDocumentIcon className="h-4 w-4" />
            Copy
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground leading-relaxed">{transcription.text}</p>
        {transcription.segments && transcription.segments.length > 1 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Segments:</p>
            {transcription.segments.map((segment, segIndex) => (
              <div key={segIndex} className="text-sm mb-1">
                <span className="text-muted-foreground">
                  {Math.floor(segment.start)}s-{Math.floor(segment.end)}s:
                </span>
                <span className="ml-2">{segment.text}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

