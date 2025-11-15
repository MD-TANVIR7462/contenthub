'use client'

import { Overview } from './sections/overview'
import { PagesSection } from './sections/pages'
import { ContentSections } from './sections/content-sections'
import { BlogEditor } from './sections/blog-editor'
import { SEOManagement } from './sections/seo-management'
import { MediaManager } from './sections/media-manager'

interface DashboardProps {
  activeSection: string
}

export function Dashboard({ activeSection }: DashboardProps) {
  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />
      case 'pages':
        return <PagesSection />
      case 'sections':
        return <ContentSections />
      case 'blog':
        return <BlogEditor />
      case 'seo':
        return <SEOManagement />
      case 'media':
        return <MediaManager />
      default:
        return <Overview />
    }
  }

  return (
    <div className="p-8">
      {renderSection()}
    </div>
  )
}
