'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Download, FolderPlus, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface MediaFile {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: string
  thumbnail: string
  folder: string
}

const demoMedia: MediaFile[] = [
  {
    id: '1',
    name: 'hero-banner.jpg',
    type: 'Image',
    size: '2.4 MB',
    uploadedAt: '2024-01-15',
    thumbnail: '/abstract-hero-banner.png',
    folder: 'homepage'
  },
  {
    id: '2',
    name: 'team-photo.jpg',
    type: 'Image',
    size: '3.1 MB',
    uploadedAt: '2024-01-14',
    thumbnail: '/diverse-team-outdoor.png',
    folder: 'about'
  },
  {
    id: '3',
    name: 'product-demo.mp4',
    type: 'Video',
    size: '15.7 MB',
    uploadedAt: '2024-01-13',
    thumbnail: '/video-production-setup.png',
    folder: 'products'
  },
  {
    id: '4',
    name: 'logo.png',
    type: 'Image',
    size: '340 KB',
    uploadedAt: '2024-01-12',
    thumbnail: '/abstract-logo.png',
    folder: 'branding'
  },
  {
    id: '5',
    name: 'banner2.jpg',
    type: 'Image',
    size: '1.8 MB',
    uploadedAt: '2024-01-11',
    thumbnail: '/celebratory-banner.png',
    folder: 'homepage'
  },
]

export function MediaManager() {
  const [media, setMedia] = useState(demoMedia)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterFolder, setFilterFolder] = useState('all')
  const [newFolderName, setNewFolderName] = useState('')
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)

  const folders = Array.from(new Set(media.map(m => m.folder)))

  const deleteMedia = (id: string) => {
    setMedia(media.filter(m => m.id !== id))
  }

  const filteredMedia = media.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFolder = filterFolder === 'all' || m.folder === filterFolder
    return matchesSearch && matchesFolder
  })

  const createFolder = () => {
    if (newFolderName.trim()) {
      setNewFolderName('')
      setShowNewFolderDialog(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
          <p className="text-muted-foreground">Upload and manage your media files</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <FolderPlus className="w-4 h-4" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input 
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>Cancel</Button>
                  <Button onClick={createFolder}>Create Folder</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Upload Media
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search media..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex gap-2 flex-wrap">
        <Button 
          variant={filterFolder === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterFolder('all')}
          size="sm"
        >
          All Files
        </Button>
        {folders.map(folder => (
          <Button 
            key={folder}
            variant={filterFolder === folder ? 'default' : 'outline'}
            onClick={() => setFilterFolder(folder)}
            size="sm"
          >
            {folder}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{filteredMedia.length} items</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMedia.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No media files found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredMedia.map((file) => (
                <div 
                  key={file.id} 
                  className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img 
                      src={file.thumbnail || "/placeholder.svg"} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-foreground truncate text-sm">{file.name}</h3>
                    <div className="text-xs text-muted-foreground space-y-1 mt-2">
                      <p>{file.type} • {file.size}</p>
                      <p className="text-xs bg-muted/50 inline-block px-2 py-1 rounded mt-1">{file.folder}</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 px-2 py-1.5 bg-muted hover:bg-muted/80 rounded text-xs flex items-center justify-center gap-1">
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                      <button 
                        onClick={() => deleteMedia(file.id)}
                        className="px-2 py-1.5 hover:bg-destructive/20 rounded text-xs"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
