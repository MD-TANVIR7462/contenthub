'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Trash2, Calendar, User, Tag, Clock, Copy, Check, Filter } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  author: string
  status: 'published' | 'draft'
  date: string
  category: string
  tags: string[]
  readingTime: number
  content?: string
}

const demoPosts: BlogPost[] = [
  { 
    id: '1', 
    title: 'Getting Started with Web Design', 
    excerpt: 'Learn the fundamentals of modern web design...',
    author: 'John Doe',
    status: 'published',
    date: '2024-01-15',
    category: 'Design',
    tags: ['web', 'design', 'tutorial'],
    readingTime: 8,
    content: 'Full article content here...'
  },
  { 
    id: '2', 
    title: 'Advanced React Patterns', 
    excerpt: 'Explore advanced patterns and best practices...',
    author: 'Jane Smith',
    status: 'published',
    date: '2024-01-14',
    category: 'Development',
    tags: ['react', 'javascript', 'advanced'],
    readingTime: 12,
    content: 'Full article content here...'
  },
  { 
    id: '3', 
    title: 'SEO Tips for 2024', 
    excerpt: 'Optimize your website for search engines...',
    author: 'Mike Johnson',
    status: 'draft',
    date: '2024-01-12',
    category: 'SEO',
    tags: ['seo', 'optimization', 'marketing'],
    readingTime: 6,
    content: 'Full article content here...'
  },
]

export function BlogEditor() {
  const [posts, setPosts] = useState(demoPosts)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<BlogPost>>({})
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const categories = Array.from(new Set(posts.map(p => p.category)))

  const deletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id))
  }

  const duplicatePost = (post: BlogPost) => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      title: `${post.title} (Copy)`,
      status: 'draft'
    }
    setPosts([...posts, newPost])
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const startEdit = (post: BlogPost) => {
    setSelectedPost(post)
    setEditForm(post)
    setIsEditing(true)
  }

  const saveEdit = () => {
    if (selectedPost && editForm.id) {
      setPosts(posts.map(p => p.id === editForm.id ? { ...selectedPost, ...editForm } as BlogPost : p))
      setIsEditing(false)
      setSelectedPost(null)
    }
  }

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200
    const wordCount = text.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  const addNewPost = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: 'New Blog Post',
      excerpt: '',
      author: 'Admin',
      status: 'draft',
      date: new Date().toISOString().split('T')[0],
      category: 'General',
      tags: [],
      readingTime: 0,
      content: ''
    }
    setPosts([...posts, newPost])
    startEdit(newPost)
  }

  const filteredPosts = posts.filter(p => {
    const matchCategory = filterCategory === 'all' || p.category === filterCategory
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       p.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground">Create and manage blog content ({posts.length})</p>
        </div>
      <Link href={'blog/new_blog'}>  <Button  className="gap-2">
          <Plus className="w-4 h-4" />
          New Post
        </Button></Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Input
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Button 
          variant={filterCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterCategory('all')}
          size="sm"
          className="gap-1"
        >
          <Filter className="w-4 h-4" />
          All
        </Button>
        {categories.map(cat => (
          <Button 
            key={cat}
            variant={filterCategory === cat ? 'default' : 'outline'}
            onClick={() => setFilterCategory(cat)}
            size="sm"
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{post.excerpt}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readingTime} min read
                    </div>
                    <span className={`px-2 py-1 rounded-full font-medium text-xs ${
                      post.status === 'published'
                        ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                        : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => copyToClipboard(post.title, post.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Copy title"
                  >
                    {copied === post.id ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-foreground" />
                    )}
                  </button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button 
                        onClick={() => startEdit(post)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-foreground" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Blog Post</DialogTitle>
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
                            <label className="text-sm font-medium text-foreground">Content</label>
                            <Textarea 
                              value={editForm.content || ''} 
                              onChange={(e) => {
                                const content = e.target.value
                                setEditForm({
                                  ...editForm, 
                                  content,
                                  readingTime: calculateReadingTime(content)
                                })
                              }}
                              className="mt-1 h-32"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground">Excerpt</label>
                            <Textarea 
                              value={editForm.excerpt || ''} 
                              onChange={(e) => setEditForm({...editForm, excerpt: e.target.value})}
                              className="mt-1 h-20"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-foreground">Category</label>
                              <Input 
                                value={editForm.category || ''} 
                                onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground">Tags (comma separated)</label>
                              <Input 
                                value={editForm.tags?.join(', ') || ''} 
                                onChange={(e) => setEditForm({...editForm, tags: e.target.value.split(',').map(t => t.trim())})}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 justify-end pt-4">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={saveEdit}>Save Changes</Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <button 
                    onClick={() => duplicatePost(post)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Duplicate post"
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
                        <AlertDialogTitle>Delete Post</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{post.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="flex gap-2 justify-end">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deletePost(post.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
