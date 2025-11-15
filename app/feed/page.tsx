'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Video, Plus, Loader2 } from 'lucide-react'
import { VideoPlayer } from '@/components/video-player'
import { SubjectFilter } from '@/components/subject-filter'
import { CreateVideoModal } from '@/components/create-video-modal'
import { TopNav } from '@/components/TopNavBar'
import { fetchVideos, VideoResponse } from '@/lib/api'

interface VideoWithMetadata extends VideoResponse {
	subject?: string
	thumbnail?: string
	character?: string
	duration?: string
}

export default function FeedPage() {
	const [videos, setVideos] = useState<VideoWithMetadata[]>([])
	const [selectedSubject, setSelectedSubject] = useState<string>('all')
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [hasMore, setHasMore] = useState(true)
	const scrollRef = useRef<HTMLDivElement>(null)

	// Load initial videos
	useEffect(() => {
		loadVideos(0)
	}, [])

	const loadVideos = async (start: number) => {
		try {
			if (start === 0) {
				setIsLoading(true)
			} else {
				setIsLoadingMore(true)
			}
			setError(null)

			const response = await fetchVideos(start)
			
			if (start === 0) {
				setVideos(response.videos)
			} else {
				setVideos(prev => [...prev, ...response.videos])
			}

			// If we got fewer than 5 videos, we've reached the end
			setHasMore(response.count === 5)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load videos')
		} finally {
			setIsLoading(false)
			setIsLoadingMore(false)
		}
	}

	// Infinite scroll handler
	const handleScroll = useCallback(() => {
		if (!scrollRef.current || isLoadingMore || !hasMore) return

		const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
		
		// Load more when we're near the bottom (within 2 screen heights)
		if (scrollHeight - scrollTop <= clientHeight * 3) {
			loadVideos(videos.length)
		}
	}, [isLoadingMore, hasMore, videos.length])

	// Attach scroll listener
	useEffect(() => {
		const scrollElement = scrollRef.current
		if (!scrollElement) return

		scrollElement.addEventListener('scroll', handleScroll)
		return () => scrollElement.removeEventListener('scroll', handleScroll)
	}, [handleScroll])

	const filteredVideos = selectedSubject === 'all'
		? videos
		: videos.filter(v => v.subject === selectedSubject)

	const subjects = ['all', ...Array.from(new Set(videos.map(v => v.subject).filter((s): s is string => Boolean(s))))]

	return (
		<div className="h-screen bg-black overflow-hidden flex flex-col">
			<TopNav
				variant="app"
				onCreateClick={() => setIsCreateModalOpen(true)}
			/>

			{/* Subject Filter */}
			{videos.length > 0 && (
				<div className="z-40 bg-white/95 backdrop-blur-sm border-b border-gray-300 shadow-sm flex-shrink-0">
					<SubjectFilter
						subjects={subjects}
						selectedSubject={selectedSubject}
						onSelectSubject={setSelectedSubject}
					/>
				</div>
			)}

			{/* Video Feed - Instagram Style */}
			<main 
				ref={scrollRef}
				className="flex-1 overflow-y-scroll snap-y snap-mandatory" 
				style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
			>
				{isLoading ? (
					<div className="h-full flex items-center justify-center">
						<div className="text-center">
							<Loader2 className="h-12 w-12 text-indigo-500 animate-spin mx-auto mb-4" />
							<p className="text-white text-lg">Loading videos...</p>
						</div>
					</div>
				) : error ? (
					<div className="h-full flex items-center justify-center">
						<div className="text-center py-20 px-4">
							<Video className="h-16 w-16 text-red-400 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-white mb-2">
								Failed to load videos
							</h3>
							<p className="text-gray-400 mb-6">{error}</p>
							<Button
								onClick={() => loadVideos(0)}
								className="bg-indigo-600 hover:bg-indigo-700 text-white"
							>
								Try Again
							</Button>
						</div>
					</div>
				) : filteredVideos.length > 0 ? (
					<>
						{filteredVideos.map((video) => (
							<div 
								key={video.id} 
								className="h-full snap-start snap-always flex items-center justify-center"
							>
								<VideoPlayer video={video} />
							</div>
						))}
						{isLoadingMore && (
							<div className="h-32 flex items-center justify-center">
								<Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
							</div>
						)}
					</>
				) : (
					<div className="h-full snap-start flex items-center justify-center">
						<div className="text-center py-20 px-4">
							<Video className="h-16 w-16 text-indigo-300 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-white mb-2">
								{selectedSubject === 'all' ? 'No videos yet' : `No videos in ${selectedSubject}`}
							</h3>
							<p className="text-gray-400 mb-6">
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
					</div>
				)}
			</main>

			{/* Create Video Modal */}
			<CreateVideoModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
			/>
		</div>
	)
}
