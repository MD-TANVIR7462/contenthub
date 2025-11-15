'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface MetaTagsPanelProps {
  metaTags: {
    description: string
    keywords: string
    ogTitle: string
    ogDescription: string
    ogImage?: string
  }
  title: string
  onMetaTagsChange: (tags: any) => void
}

export function MetaTagsPanel({ metaTags, title, onMetaTagsChange }: MetaTagsPanelProps) {
  const calculateSeoScore = () => {
    let score = 0
    if (title && title.length >= 30 && title.length <= 60) score += 20
    if (title && title.length > 0) score += 10
    if (metaTags.description && metaTags.description.length >= 120 && metaTags.description.length <= 160) score += 25
    if (metaTags.description && metaTags.description.length > 0) score += 15
    if (metaTags.keywords && metaTags.keywords.split(',').length >= 3) score += 15
    if (metaTags.ogTitle && metaTags.ogTitle.length > 0) score += 8
    if (metaTags.ogDescription && metaTags.ogDescription.length > 0) score += 7
    if (metaTags.ogImage) score += 10
    return Math.min(score, 100)
  }

  const seoScore = calculateSeoScore()
  const seoColor = seoScore >= 75 ? 'text-green-600' : seoScore >= 50 ? 'text-yellow-600' : 'text-red-600'

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">SEO & Meta Tags</CardTitle>
          <div className="text-right">
            <div className={`text-2xl font-bold ${seoColor}`}>{seoScore}</div>
            <p className="text-xs text-muted-foreground">SEO Score</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title Info */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">Meta Title</label>
            <span className={`text-xs ${title.length > 60 ? 'text-red-600' : title.length < 30 ? 'text-yellow-600' : 'text-green-600'}`}>
              {title.length}/60
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">Ideal: 30-60 characters</p>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">Meta Description</label>
            <span className={`text-xs ${metaTags.description.length > 160 ? 'text-red-600' : metaTags.description.length < 120 ? 'text-yellow-600' : 'text-green-600'}`}>
              {metaTags.description.length}/160
            </span>
          </div>
          <Textarea
            value={metaTags.description}
            onChange={(e) => onMetaTagsChange({...metaTags, description: e.target.value})}
            placeholder="Enter meta description (120-160 characters)"
            className="h-20 text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">Ideal: 120-160 characters</p>
        </div>

        {/* Keywords */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Keywords</label>
          <Input
            value={metaTags.keywords}
            onChange={(e) => onMetaTagsChange({...metaTags, keywords: e.target.value})}
            placeholder="keyword1, keyword2, keyword3"
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">Comma separated, at least 3 recommended</p>
        </div>

        {/* Open Graph Tags */}
        <div className="border-t pt-4 space-y-3">
          <p className="text-sm font-medium text-foreground">Open Graph Tags</p>
          
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">OG Title</label>
            <Input
              value={metaTags.ogTitle}
              onChange={(e) => onMetaTagsChange({...metaTags, ogTitle: e.target.value})}
              placeholder="Social media title"
              className="text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">OG Description</label>
            <Textarea
              value={metaTags.ogDescription}
              onChange={(e) => onMetaTagsChange({...metaTags, ogDescription: e.target.value})}
              placeholder="Social media description"
              className="h-16 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">OG Image URL</label>
            <Input
              value={metaTags.ogImage || ''}
              onChange={(e) => onMetaTagsChange({...metaTags, ogImage: e.target.value})}
              placeholder="https://example.com/image.jpg"
              type="url"
              className="text-sm"
            />
          </div>
        </div>

        {/* SEO Tips */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm space-y-1">
          <p className="font-medium text-blue-900 dark:text-blue-100">SEO Tips:</p>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Use primary keyword in title</li>
            <li>• Keep description between 120-160 chars</li>
            <li>• Include 3+ relevant keywords</li>
            <li>• Add OG tags for social sharing</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
