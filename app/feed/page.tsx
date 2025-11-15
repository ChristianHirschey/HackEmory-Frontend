'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Video, Plus, Home, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { VideoPlayer } from '@/components/video-player'
import { SubjectFilter } from '@/components/subject-filter'
import { CreateVideoModal } from '@/components/create-video-modal'

// Mock video data - replace with real data from your backend
const mockVideos = [
  {
    id: '1',
    title: 'The Pythagorean Theorem Explained',
    subject: 'Math',
    videoUrl: '/placeholder.mp4',
    thumbnail: '/pythagorean-theorem-math-diagram.jpg',
    character: 'Peter Griffin',
    duration: '0:45',
  },
  {
    id: '2',
    title: 'World War II Overview',
    subject: 'History',
    videoUrl: '/placeholder.mp4',
    thumbnail: '/world-war-2-history.jpg',
    character: 'Stewie Griffin',
    duration: '1:20',
  },
  {
    id: '3',
    title: 'Photosynthesis Process',
    subject: 'Science',
    videoUrl: '/placeholder.mp4',
    thumbnail: '/photosynthesis-biology-plant.jpg',
    character: 'Brian Griffin',
    duration: '0:55',
  },
  {
    id: '4',
    title: 'Shakespeare\'s Hamlet',
    subject: 'Literature',
    videoUrl: '/placeholder.mp4',
    thumbnail: '/shakespeare-hamlet-literature.jpg',
    character: 'Peter Griffin',
    duration: '1:10',
  },
  {
    id: '5',
    title: 'Chemical Reactions Basics',
    subject: 'Science',
    videoUrl: '/placeholder.mp4',
    thumbnail: '/chemistry-reactions-science.jpg',
    character: 'Stewie Griffin',
    duration: '0:50',
  },
]

export default function FeedPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const filteredVideos = selectedSubject === 'all' 
    ? mockVideos 
    : mockVideos.filter(v => v.subject === selectedSubject)

  const subjects = ['all', ...Array.from(new Set(mockVideos.map(v => v.subject)))]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Video className="h-7 w-7 text-indigo-500" />
            <span className="text-xl font-bold">StudySnap</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
            >
              <Plus className="h-4 w-4" />
              Create
            </Button>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <User className="h-5 w-5" />
              </Button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2">
                  <Link href="/">
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Home
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-700 flex items-center gap-2 text-red-400">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Subject Filter */}
      <div className="fixed top-[60px] left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <SubjectFilter
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSelectSubject={setSelectedSubject}
        />
      </div>

      {/* Video Feed */}
      <main className="pt-[120px] pb-20">
        <div className="max-w-md mx-auto">
          {filteredVideos.length > 0 ? (
            <div className="space-y-4">
              {filteredVideos.map((video) => (
                <VideoPlayer key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-4">
              <Video className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No videos in {selectedSubject}
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first video to get started!
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Video
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Create Video Modal */}
      <CreateVideoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}
