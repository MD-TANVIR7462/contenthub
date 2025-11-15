'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Eye, Send } from 'lucide-react'

interface PublishingPanelProps {
  status: 'published' | 'draft' | 'scheduled'
  scheduledDate?: string
  publishedDate?: string
  onStatusChange: (status: 'published' | 'draft' | 'scheduled') => void
  onScheduledDateChange: (date: string) => void
  readingTime: number
  views: number
}

export function PublishingPanel({
  status,
  scheduledDate,
  publishedDate,
  onStatusChange,
  onScheduledDateChange,
  readingTime,
  views,
}: PublishingPanelProps) {
  const [showScheduleInput, setShowScheduleInput] = useState(false)

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Publishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={status === 'draft' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusChange('draft')}
              className="text-xs"
            >
              Draft
            </Button>
            <Button
              variant={status === 'scheduled' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                onStatusChange('scheduled')
                setShowScheduleInput(true)
              }}
              className="text-xs"
            >
              Schedule
            </Button>
            <Button
              variant={status === 'published' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusChange('published')}
              className="text-xs gap-1"
            >
              <Send className="w-3 h-3" />
              Publish
            </Button>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge 
              variant={status === 'published' ? 'default' : status === 'scheduled' ? 'secondary' : 'outline'}
              className="w-full justify-center py-1.5"
            >
              {status === 'published' && '✓ Published'}
              {status === 'draft' && '✎ Draft'}
              {status === 'scheduled' && '📅 Scheduled'}
            </Badge>
          </div>

          {/* Published Date */}
          {publishedDate && (
            <div className="text-xs">
              <p className="text-muted-foreground mb-1">Published Date</p>
              <p className="font-medium text-foreground">{publishedDate}</p>
            </div>
          )}

          {/* Schedule Input */}
          {showScheduleInput && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Schedule for</label>
              <Input
                type="datetime-local"
                value={scheduledDate || ''}
                onChange={(e) => onScheduledDateChange(e.target.value)}
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">Post will auto-publish at this time</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Reading Time</span>
            </div>
            <span className="font-semibold text-foreground">{readingTime} min</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Views</span>
            </div>
            <span className="font-semibold text-foreground">{views.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created</span>
            </div>
            <span className="font-semibold text-foreground">Jan 15, 2024</span>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-sm space-y-2">
            <p className="font-medium text-amber-900 dark:text-amber-100">Before Publishing:</p>
            <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
              <li>✓ Add meta tags for SEO</li>
              <li>✓ Set appropriate category</li>
              <li>✓ Add relevant tags</li>
              <li>✓ Preview content</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
