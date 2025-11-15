'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Trash2, Copy, Search, Filter } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SEOEntry {
  id: string
  page: string
  title: string
  description: string
  keywords: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  seoScore: number
  createdAt: string
  updatedAt: string
}

const demoSEO: SEOEntry[] = [
  {
    id: '1',
    page: 'Home',
    title: 'Your Company - Premium Services',
    description: 'Discover our premium services and solutions for your business needs.',
    keywords: 'services, solutions, business, company',
    ogTitle: 'Your Company - Premium Services',
    ogDescription: 'Discover our premium services and solutions for your business needs.',
    seoScore: 85,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    page: 'About',
    title: 'About Us - Company Story',
    description: 'Learn about our company, mission, and the team behind our success.',
    keywords: 'about, company, team, mission',
    ogTitle: 'About Us - Company Story',
    seoScore: 72,
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14',
  },
  {
    id: '3',
    page: 'Services',
    title: 'Our Services - Professional Solutions',
    description: 'Explore our professional services tailored to your needs.',
    keywords: 'services, solutions, professional, help',
    seoScore: 68,
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13',
  },
]

const calculateSEOScore = (title: string, description: string, keywords: string, ogTitle?: string, ogDescription?: string): number => {
  let score = 50
  
  if (title.length >= 30 && title.length <= 60) score += 10
  if (description.length >= 120 && description.length <= 160) score += 10
  if (keywords.split(',').filter(k => k.trim()).length >= 3) score += 10
  if (keywords.split(',').filter(k => k.trim()).length <= 8) score += 10
  if (ogTitle && ogTitle.length > 0) score += 5
  if (ogDescription && ogDescription.length > 0) score += 5
  
  return Math.min(100, score)
}

export function SEOManagement() {
  const [seoData, setSeoData] = useState(demoSEO)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterScore, setFilterScore] = useState('all')
  const [formData, setFormData] = useState<Partial<SEOEntry>>({
    page: '',
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
  })

  const filteredData = seoData.filter(entry => {
    const matchesSearch = entry.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesScore = filterScore === 'all' || 
                        (filterScore === 'excellent' && entry.seoScore >= 80) ||
                        (filterScore === 'good' && entry.seoScore >= 60 && entry.seoScore < 80) ||
                        (filterScore === 'poor' && entry.seoScore < 60)
    return matchesSearch && matchesScore
  })

  const resetForm = () => {
    setFormData({
      page: '',
      title: '',
      description: '',
      keywords: '',
      ogTitle: '',
      ogDescription: '',
    })
  }

  const handleSave = () => {
    if (!formData.page || !formData.title) {
      alert('Please fill in required fields')
      return
    }

    const score = calculateSEOScore(
      formData.title,
      formData.description || '',
      formData.keywords || '',
      formData.ogTitle,
      formData.ogDescription
    )

    if (editingId) {
      setSeoData(seoData.map(s =>
        s.id === editingId
          ? { ...s, ...formData, seoScore: score, updatedAt: new Date().toISOString().split('T')[0] } as SEOEntry
          : s
      ))
    } else {
      const newEntry: SEOEntry = {
        id: Date.now().toString(),
        ...formData as Omit<SEOEntry, 'id'>,
        seoScore: score,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      }
      setSeoData([...seoData, newEntry])
    }

    setEditingId(null)
    setIsAdding(false)
    resetForm()
  }

  const handleEdit = (entry: SEOEntry) => {
    setFormData(entry)
    setEditingId(entry.id)
    setIsAdding(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this SEO entry?')) {
      setSeoData(seoData.filter(s => s.id !== id))
    }
  }

  const handleDuplicate = (entry: SEOEntry) => {
    const newEntry: SEOEntry = {
      ...entry,
      id: Date.now().toString(),
      page: entry.page + ' (Copy)',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }
    setSeoData([...seoData, newEntry])
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const getSEOScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">SEO Management</h1>
          <p className="text-muted-foreground">Manage meta tags and SEO content for your pages</p>
        </div>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button 
              className="gap-2"
              onClick={() => {
                resetForm()
                setEditingId(null)
              }}
            >
              <Plus className="w-4 h-4" />
              New SEO Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit SEO Entry' : 'Create New SEO Entry'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Page Name *</label>
                <Input 
                  value={formData.page || ''} 
                  onChange={(e) => setFormData({...formData, page: e.target.value})}
                  className="mt-1"
                  placeholder="e.g., Home, About, Services"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Meta Title (30-60 chars) *</label>
                <Input 
                  value={formData.title || ''} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="mt-1"
                  maxLength={60}
                  placeholder="Your page title for search engines"
                />
                <p className="text-xs text-muted-foreground mt-1">{formData.title?.length || 0}/60</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Meta Description (120-160 chars) *</label>
                <Textarea 
                  value={formData.description || ''} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="mt-1"
                  maxLength={160}
                  placeholder="Brief description for search results"
                />
                <p className="text-xs text-muted-foreground mt-1">{formData.description?.length || 0}/160</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Keywords (comma separated)</label>
                <Input 
                  value={formData.keywords || ''} 
                  onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                  className="mt-1"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground mb-3">Open Graph Tags (Social Media)</p>
                
                <div>
                  <label className="text-sm font-medium text-foreground">OG Title</label>
                  <Input 
                    value={formData.ogTitle || ''} 
                    onChange={(e) => setFormData({...formData, ogTitle: e.target.value})}
                    className="mt-1"
                    placeholder="Title for social sharing"
                  />
                </div>

                <div className="mt-3">
                  <label className="text-sm font-medium text-foreground">OG Description</label>
                  <Textarea 
                    value={formData.ogDescription || ''} 
                    onChange={(e) => setFormData({...formData, ogDescription: e.target.value})}
                    className="mt-1"
                    placeholder="Description for social sharing"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAdding(false)
                    setEditingId(null)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingId ? 'Update Entry' : 'Create Entry'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground">Search</label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by page name or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-48">
          <label className="text-sm font-medium text-foreground">Filter by Score</label>
          <Select value={filterScore} onValueChange={setFilterScore}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Scores</SelectItem>
              <SelectItem value="excellent">Excellent (80+)</SelectItem>
              <SelectItem value="good">Good (60-79)</SelectItem>
              <SelectItem value="poor">Poor (&lt;60)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No SEO entries found</p>
          </Card>
        ) : (
          filteredData.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{entry.page}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Updated: {entry.updatedAt}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getSEOScoreColor(entry.seoScore)}`}>
                      {entry.seoScore}
                    </p>
                    <p className="text-xs text-muted-foreground">SEO Score</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-foreground">Meta Title</label>
                    <span className="text-xs text-muted-foreground">{entry.title.length}/60</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{entry.title}</p>
                  <button 
                    onClick={() => handleCopyToClipboard(entry.title)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
                  >
                    Copy title
                  </button>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-foreground">Meta Description</label>
                    <span className="text-xs text-muted-foreground">{entry.description.length}/160</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{entry.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Keywords</label>
                  <p className="text-sm text-muted-foreground mt-1">{entry.keywords}</p>
                </div>

                {(entry.ogTitle || entry.ogDescription) && (
                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-semibold text-foreground mb-2">Open Graph</p>
                    {entry.ogTitle && <p className="text-xs text-muted-foreground">OG Title: {entry.ogTitle}</p>}
                    {entry.ogDescription && <p className="text-xs text-muted-foreground">OG Desc: {entry.ogDescription}</p>}
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-foreground">Overall Score</label>
                    <span className="text-xs text-muted-foreground">{entry.seoScore}%</span>
                  </div>
                  <Progress value={entry.seoScore} className="h-2" />
                </div>

                <div className="flex gap-2 pt-2 flex-wrap">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(entry)}
                    className="gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDuplicate(entry)}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        Showing {filteredData.length} of {seoData.length} entries
      </div>
    </div>
  )
}
