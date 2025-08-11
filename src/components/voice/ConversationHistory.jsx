import { Card, CardContent } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'

export function ConversationHistory({ 
  conversations, 
  currentConversationId, 
  onLoadConversation, 
  onDeleteConversation,
  onBack 
}) {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            ← Back
          </Button>
          <h1 className="text-2xl font-bold">Conversation History</h1>
          <div className="w-16"></div>
        </div>

        {conversations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No conversations yet</p>
              <p className="text-sm text-muted-foreground mt-2">Start recording to create your first conversation</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Card key={conversation.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1" onClick={() => onLoadConversation(conversation)}>
                      <h3 className="font-semibold mb-2">{conversation.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(conversation.createdAt).toLocaleDateString()} • {conversation.transcriptions.length} transcription{conversation.transcriptions.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {conversation.transcriptions[0]?.text || 'No content'}
                      </p>
                      {conversation.id === currentConversationId && (
                        <Badge variant="secondary" className="mt-2">Current</Badge>
                      )}
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm('Delete this conversation?')) {
                          onDeleteConversation(conversation.id)
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

