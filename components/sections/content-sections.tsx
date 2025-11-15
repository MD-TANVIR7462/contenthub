'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, Copy, Search } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Item {
  id: string
  title: string
  description?: string
}

interface Section {
  id: string
  name: string
  type: 'services' | 'projects' | 'about' | 'testimonials'
  itemCount: number
  updatedAt: string
  items: Item[]
}

const demoSections: Section[] = [
  { 
    id: '1', 
    name: 'Services', 
    type: 'services', 
    itemCount: 5, 
    updatedAt: '2024-01-15',
    items: [
      { id: 's1', title: 'Web Design', description: 'Beautiful website design' },
      { id: 's2', title: 'Development', description: 'Full-stack development' },
      { id: 's3', title: 'SEO Optimization', description: 'Search engine optimization' },
      { id: 's4', title: 'Maintenance', description: 'Site maintenance' },
      { id: 's5', title: 'Consulting', description: 'Business consulting' },
    ]
  },
  { 
    id: '2', 
    name: 'Projects', 
    type: 'projects', 
    itemCount: 3, 
    updatedAt: '2024-01-14',
    items: [
      { id: 'p1', title: 'E-commerce Platform', description: 'Full e-commerce solution' },
      { id: 'p2', title: 'Mobile App', description: 'iOS and Android app' },
      { id: 'p3', title: 'Analytics Dashboard', description: 'Real-time analytics' },
    ]
  },
  { 
    id: '3', 
    name: 'About Team', 
    type: 'about', 
    itemCount: 2, 
    updatedAt: '2024-01-13',
    items: [
      { id: 'a1', title: 'John Founder', description: 'CEO and Founder' },
      { id: 'a2', title: 'Sarah Lead', description: 'Tech Lead' },
    ]
  },
]

export function ContentSections() {
  const [sections, setSections] = useState(demoSections)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isAddingSection, setIsAddingSection] = useState(false)
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sectionForm, setSectionForm] = useState<Partial<Section>>({
    name: '',
    type: 'services',
  })
  const [itemForm, setItemForm] = useState<Partial<Item>>({
    title: '',
    description: '',
  })

  const filteredSections = sections.filter(section => {
    const matchesSearch = section.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || section.type === filterType
    return matchesSearch && matchesFilter
  })

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const resetSectionForm = () => {
    setSectionForm({ name: '', type: 'services' })
    setEditingSectionId(null)
  }

  const resetItemForm = () => {
    setItemForm({ title: '', description: '' })
    setEditingItemId(null)
  }

  const handleSaveSection = () => {
    if (!sectionForm.name) {
      alert('Please enter a section name')
      return
    }

    if (editingSectionId) {
      setSections(sections.map(s =>
        s.id === editingSectionId
          ? { ...s, ...sectionForm, updatedAt: new Date().toISOString().split('T')[0] } as Section
          : s
      ))
    } else {
      const newSection: Section = {
        id: Date.now().toString(),
        name: sectionForm.name || 'New Section',
        type: sectionForm.type as any || 'services',
        itemCount: 0,
        updatedAt: new Date().toISOString().split('T')[0],
        items: [],
      }
      setSections([...sections, newSection])
    }

    setIsAddingSection(false)
    resetSectionForm()
  }

  const handleEditSection = (section: Section) => {
    setSectionForm(section)
    setEditingSectionId(section.id)
    setIsAddingSection(true)
  }

  const handleDeleteSection = (id: string) => {
    if (confirm('Are you sure you want to delete this section and all its items?')) {
      setSections(sections.filter(s => s.id !== id))
    }
  }

  const handleDuplicateSection = (section: Section) => {
    const newSection: Section = {
      ...section,
      id: Date.now().toString(),
      name: section.name + ' (Copy)',
      updatedAt: new Date().toISOString().split('T')[0],
      items: section.items.map(item => ({...item, id: Date.now().toString() + Math.random()})),
    }
    setSections([...sections, newSection])
  }

  const handleAddItem = (sectionId: string) => {
    if (!itemForm.title) {
      alert('Please enter item title')
      return
    }

    setSections(sections.map(s =>
      s.id === sectionId
        ? {
          ...s,
          items: [...s.items, { id: Date.now().toString(), ...itemForm as Item }],
          itemCount: s.items.length + 1,
        }
        : s
    ))
    resetItemForm()
  }

  const handleDeleteItem = (sectionId: string, itemId: string) => {
    if (confirm('Delete this item?')) {
      setSections(sections.map(s =>
        s.id === sectionId
          ? {
            ...s,
            items: s.items.filter(i => i.id !== itemId),
            itemCount: s.items.filter(i => i.id !== itemId).length,
          }
          : s
      ))
    }
  }

  const handleEditItem = (item: Item) => {
    setItemForm(item)
    setEditingItemId(item.id)
  }

  const handleSaveItem = (sectionId: string) => {
    if (!itemForm.title) {
      alert('Please enter item title')
      return
    }

    setSections(sections.map(s =>
      s.id === sectionId
        ? {
          ...s,
          items: s.items.map(i =>
            i.id === editingItemId ? { ...i, ...itemForm } as Item : i
          ),
        }
        : s
    ))
    resetItemForm()
  }

  const getTypeColor = (type: string) => {
    const colors = {
      services: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
      projects: 'bg-purple-500/20 text-purple-700 dark:text-purple-400',
      about: 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-400',
      testimonials: 'bg-pink-500/20 text-pink-700 dark:text-pink-400',
    }
    return colors[type as keyof typeof colors] || colors.services
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Sections</h1>
          <p className="text-muted-foreground">Manage services, projects, team, and testimonials</p>
        </div>
        <Dialog open={isAddingSection} onOpenChange={setIsAddingSection}>
          <DialogTrigger asChild>
            <Button 
              className="gap-2"
              onClick={() => resetSectionForm()}
            >
              <Plus className="w-4 h-4" />
              New Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSectionId ? 'Edit Section' : 'Create New Section'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Section Name *</label>
                <Input 
                  value={sectionForm.name || ''} 
                  onChange={(e) => setSectionForm({...sectionForm, name: e.target.value})}
                  className="mt-1"
                  placeholder="e.g., Services, Projects"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Section Type *</label>
                <Select value={sectionForm.type} onValueChange={(val) => setSectionForm({...sectionForm, type: val as any})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                    <SelectItem value="about">About</SelectItem>
                    <SelectItem value="testimonials">Testimonials</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddingSection(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveSection}>
                  {editingSectionId ? 'Update Section' : 'Create Section'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-foreground">Search</label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-48">
          <label className="text-sm font-medium text-foreground">Filter by Type</label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="projects">Projects</SelectItem>
              <SelectItem value="about">About</SelectItem>
              <SelectItem value="testimonials">Testimonials</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredSections.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No sections found</p>
          </Card>
        ) : (
          filteredSections.map((section) => (
            <Card key={section.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{section.name}</CardTitle>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(section.type)}`}>
                        {section.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-sm text-muted-foreground">
                        {section.itemCount} items
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Updated: {section.updatedAt}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleExpand(section.id)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    {expandedId === section.id ? 
                      <ChevronUp className="w-4 h-4" /> : 
                      <ChevronDown className="w-4 h-4" />
                    }
                  </button>
                </div>
              </CardHeader>

              {expandedId === section.id && (
                <CardContent className="space-y-4">
                  <div className="border-t border-border pt-4">
                    <div className="space-y-2 mb-4">
                      {section.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.title}</p>
                            {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditItem(item)}
                              className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(section.id, item.id)}
                              className="p-2 hover:bg-destructive/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {editingItemId && (
                      <div className="bg-blue-500/5 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 space-y-3">
                        <p className="text-sm font-medium text-foreground">Edit Item</p>
                        <Input 
                          value={itemForm.title || ''} 
                          onChange={(e) => setItemForm({...itemForm, title: e.target.value})}
                          placeholder="Item title"
                        />
                        <Textarea 
                          value={itemForm.description || ''} 
                          onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
                          placeholder="Item description"
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleSaveItem(section.id)}
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => resetItemForm()}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="bg-green-500/5 border border-green-200 dark:border-green-800 rounded-lg p-3 space-y-3">
                      <p className="text-sm font-medium text-foreground">Add New Item</p>
                      <Input 
                        value={itemForm.title || ''} 
                        onChange={(e) => setItemForm({...itemForm, title: e.target.value})}
                        placeholder="Item title"
                      />
                      <Textarea 
                        value={itemForm.description || ''} 
                        onChange={(e) => setItemForm({...itemForm, description: e.target.value})}
                        placeholder="Item description"
                      />
                      <Button 
                        size="sm"
                        onClick={() => handleAddItem(section.id)}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 flex-wrap border-t border-border pt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditSection(section)}
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Section
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDuplicateSection(section)}
                      className="gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteSection(section.id)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        Showing {filteredSections.length} of {sections.length} sections
      </div>
    </div>
  )
}
