import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import axios from 'axios'

export function ApiConfiguration({ apiUrl, onApiUrlChange }) {
  const testConnection = async () => {
    try {
      const response = await axios.get(`${apiUrl}/health`, { timeout: 5000 })
      alert(`✅ Server is healthy!\n\nDevice: ${response.data.device_info?.device || 'Unknown'}\nModel: ${response.data.model_info?.model || 'Unknown'}\nStatus: ${response.data.status}`)
    } catch (error) {
      console.error('Connection test failed:', error)
      if (error.code === 'ECONNABORTED') {
        alert('❌ Connection timeout. Please check if the server is running and the URL is correct.')
      } else if (error.response) {
        alert(`❌ Server error: ${error.response.status} ${error.response.statusText}`)
      } else {
        alert('❌ Server is not responding. Please check the URL and ensure the server is running.')
      }
    }
  }

  const getServerStatus = () => {
    // Simple check if URL looks valid
    try {
      new URL(apiUrl)
      return 'configured'
    } catch {
      return 'invalid'
    }
  }

  const status = getServerStatus()

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">API Configuration</CardTitle>
          <Badge variant={status === 'configured' ? 'secondary' : 'destructive'}>
            {status === 'configured' ? 'Configured' : 'Invalid URL'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input 
              type="text" 
              value={apiUrl}
              onChange={(e) => onApiUrlChange(e.target.value)}
              placeholder="http://localhost:5000/api/whisper"
              className="flex-1"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={testConnection}
              disabled={status !== 'configured'}
            >
              Test
            </Button>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Make sure your Python API server is running on this URL</p>
            <p>• For local development: http://localhost:5000/api/whisper</p>
            <p>• For network access: http://YOUR_IP:5000/api/whisper</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

