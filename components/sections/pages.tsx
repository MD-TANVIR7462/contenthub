'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Trash2, Eye, Calendar, Clock, Copy, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'

interface Page {
  id: string
  title: string
  slug: string
  status: 'published' | 'draft' | 'scheduled'
  updatedAt: string
  views: number
  scheduledDate?: string
  content?: string
}

const demoPages: Page[] = [
  { id: '1', title: 'Home', slug: '/', status: 'published', updatedAt: '2024-01-15', views: 4523, content: 'Welcome to our website' },
  { id: '2', title: 'About Us', slug: '/about', status: 'published', updatedAt: '2024-01-14', views: 1203, content: 'Learn about our company' },
  { id: '3', title: 'Services', slug: '/services', status: 'published', updatedAt: '2024-01-13', views: 892, content: 'Our services' },
  { id: '4', title: 'Contact', slug: '/contact', status: 'draft', updatedAt: '2024-01-12', views: 0, content: 'Contact us' },
  { id: '5', title: 'New Feature Launch', slug: '/features', status: 'scheduled', scheduledDate: '2024-02-01', updatedAt: '2024-01-10', views: 0, content: 'Announcing new features' },
]

export function PagesSection() {
  const [pages, setPages] = useState(demoPages)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Page>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const deletePage = (id: string) => {
    setPages(pages.filter(p => p.id !== id))
  }

  const duplicatePage = (page: Page) => {
    const newPage: Page = {
      ...page,
      id: Date.now().toString(),
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-copy`,
      status: 'draft',
      views: 0
    }
    setPages([...pages, newPage])
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const startEdit = (page: Page) => {
    setSelectedPage(page)
    setEditForm(page)
    setIsEditing(true)
  }

  const saveEdit = () => {
    if (selectedPage && editForm.id) {
      setPages(pages.map(p => p.id === editForm.id ? { ...selectedPage, ...editForm } : p))
      setIsEditing(false)
      setSelectedPage(null)
    }
  }

  const addNewPage = () => {
    const newPage: Page = {
      id: Date.now().toString(),
      title: 'New Page',
      slug: '/new-page',
      status: 'draft',
      updatedAt: new Date().toISOString().split('T')[0],
      views: 0,
      content: ''
    }
    setPages([...pages, newPage])
    startEdit(newPage)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'published': 'bg-green-500/20 text-green-700 dark:text-green-400',
      'draft': 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
      'scheduled': 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
    }
    return colors[status as keyof typeof colors] || colors.draft
  }

  const filteredPages = pages.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pages</h1>
          <p className="text-muted-foreground">Manage your website pages ({pages.length})</p>
        </div>
        <Button onClick={addNewPage} className="gap-2">
          <Plus className="w-4 h-4" />
          New Page
        </Button>
      </div>

      <Input
        placeholder="Search pages..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-xs"
      />

      <Card>
        <CardHeader>
          <CardTitle>All Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Slug</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">Views</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Updated</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map((page) => (
                  <tr key={page.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-foreground font-medium">{page.title}</td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{page.slug}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(page.status)}`}>
                          {page.status}
                        </span>
                        {page.scheduledDate && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {page.scheduledDate}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <Eye className="w-3 h-3" />
                        {page.views}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">{page.updatedAt}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => copyToClipboard(page.slug, page.id)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Copy slug"
                        >
                          {copied === page.id ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-foreground" />
                          )}
                        </button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button 
                              onClick={() => startEdit(page)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-foreground" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Page</DialogTitle>
                            </DialogHeader>
                            {isEditing && (
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-foreground">Title</label>
                                  <Input 
                                    value={editForm.title || ''} 
                                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Slug</label>
                                  <Input 
                                    value={editForm.slug || ''} 
                                    onChange={(e) => setEditForm({...editForm, slug: e.target.value})}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Content</label>
                                  <Textarea 
                                    value={editForm.content || ''} 
                                    onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                                    className="mt-1 h-32"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-foreground">Status</label>
                                  <Select value={editForm.status} onValueChange={(val) => setEditForm({...editForm, status: val as any})}>
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="draft">Draft</SelectItem>
                                      <SelectItem value="scheduled">Scheduled</SelectItem>
                                      <SelectItem value="published">Published</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                {editForm.status === 'scheduled' && (
                                  <div>
                                    <label className="text-sm font-medium text-foreground">Publish Date</label>
                                    <Input 
                                      type="date"
                                      value={editForm.scheduledDate || ''} 
                                      onChange={(e) => setEditForm({...editForm, scheduledDate: e.target.value})}
                                      className="mt-1"
                                    />
                                  </div>
                                )}
                                <div className="flex gap-2 justify-end pt-4">
                                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                  <Button onClick={saveEdit}>Save Changes</Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <button 
                          onClick={() => duplicatePage(page)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Duplicate page"
                        >
                          <Copy className="w-4 h-4 text-foreground" />
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="p-2 hover:bg-destructive/20 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Page</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{page.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex gap-2 justify-end">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deletePage(page.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Delete
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
