'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Eye, Save, Clock, Calendar } from 'lucide-react'
import Link from 'next/link'
import { RichTextEditor } from '@/components/blog/rich-text-editor'
import { MetaTagsPanel } from '@/components/blog/meta-tags-panel'
import { PublishingPanel } from '@/components/blog/publishing-panel'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  tags: string[]
  status: 'published' | 'draft' | 'scheduled'
  publishedDate?: string
  scheduledDate?: string
  readingTime: number
  metaTags: {
    description: string
    keywords: string
    ogTitle: string
    ogDescription: string
    ogImage?: string
  }
  views?: number
}

const demoBlogPost: BlogPost = {
  id: '1',
  title: 'Getting Started with Web Design',
  excerpt: 'Learn the fundamentals of modern web design and best practices',
  content: '<h2>Introduction</h2><p>Web design is the process of creating beautiful and functional websites...</p>',
  author: 'John Doe',
  category: 'Design',
  tags: ['web', 'design', 'tutorial'],
  status: 'draft',
  readingTime: 8,
  metaTags: {
    description: 'Learn web design fundamentals',
    keywords: 'web design, tutorials, beginners',
    ogTitle: 'Web Design Guide',
    ogDescription: 'Master the basics of modern web design',
  },
  views: 0,
}

export default function BlogEditPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost>(demoBlogPost)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const calculateReadingTime = (htmlContent: string) => {
    const textContent = htmlContent.replace(/<[^>]*>/g, '')
    const wordCount = textContent.split(/\s+/).length
    return Math.ceil(wordCount / 200)
  }

  const handleContentChange = (content: string) => {
    setPost(prev => ({
      ...prev,
      content,
      readingTime: calculateReadingTime(content)
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    console.log('Blog post saved:', post)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur ">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Blog Editor</h1>
              <p className="text-sm text-muted-foreground">
                {post.status === 'published' ? 'Published' : post.status === 'scheduled' ? 'Scheduled' : 'Draft'} • {post.readingTime} min read
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Title</label>
                <Input 
                  value={post.title} 
                  onChange={(e) => setPost({...post, title: e.target.value})}
                  placeholder="Enter post title"
                  className="mt-2 text-lg"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Excerpt</label>
                <Textarea 
                  value={post.excerpt} 
                  onChange={(e) => setPost({...post, excerpt: e.target.value})}
                  placeholder="Enter post excerpt"
                  className="mt-2 h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Category</label>
                  <Input 
                    value={post.category} 
                    onChange={(e) => setPost({...post, category: e.target.value})}
                    placeholder="Design, Development, etc."
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Author</label>
                  <Input 
                    value={post.author} 
                    onChange={(e) => setPost({...post, author: e.target.value})}
                    placeholder="Author name"
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Tags (comma separated)</label>
                <Input 
                  value={post.tags.join(', ')} 
                  onChange={(e) => setPost({...post, tags: e.target.value.split(',').map(t => t.trim())})}
                  placeholder="tag1, tag2, tag3"
                  className="mt-2"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rich Text Editor */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <p className="text-sm text-muted-foreground">Design your blog post with rich formatting</p>
            </CardHeader>
            <CardContent>
              <RichTextEditor 
                value={post.content} 
                onChange={handleContentChange}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Meta Tags & SEO */}
          <MetaTagsPanel 
            metaTags={post.metaTags}
            title={post.title}
            onMetaTagsChange={(metaTags) => setPost({...post, metaTags})}
          />

          {/* Publishing Controls */}
          <PublishingPanel 
            status={post.status}
            scheduledDate={post.scheduledDate}
            publishedDate={post.publishedDate}
            onStatusChange={(status) => setPost({...post, status})}
            onScheduledDateChange={(date) => setPost({...post, scheduledDate: date})}
            readingTime={post.readingTime}
            views={post.views || 0}
          />
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-96 overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{post.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">{post.excerpt}</p>
                </div>
                <button 
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-2xl"
                >
                  ×
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
