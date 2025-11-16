'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Video as VideoIcon, Plus, Loader2 } from 'lucide-react'
import { VideoPlayer, VideoPlayerRef } from '@/components/video-player'
import { SubjectFilter } from '@/components/subject-filter'
import { CreateVideoModal } from '@/components/create-video-modal'
import { TopNav } from '@/components/TopNavBar'
import { fetchVideosPage, VideoResponse } from '@/lib/api'

interface VideoWithMetadata extends VideoResponse {
	subject?: string
	thumbnail?: string
	character?: string
	duration?: string
}

export default function FeedPage() {
	const [selectedSubject, setSelectedSubject] = useState<string>('all')
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

	// Scroll container ref (the vertical feed)
	const scrollRef = useRef<HTMLDivElement>(null)

	// Which video is currently most visible
	const [activeIndex, setActiveIndex] = useState(0)

	// Refs for each VideoPlayer instance (to control play/pause if needed)
	const videoRefs = useRef<(VideoPlayerRef | null)[]>([])

	// Refs for each video container div (used for IntersectionObserver)
	const videoContainersRef = useRef<(HTMLDivElement | null)[]>([])

	// Infinite query for videos
	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetching,
		isFetchingNextPage,
		status,
	} = useInfiniteQuery({
		queryKey: ['videos'],
		queryFn: fetchVideosPage,
		initialPageParam: 0,
		getNextPageParam: (lastPage: { start: number; count: number; videos: VideoResponse[] }) => {
			// If we got 5 videos, there might be more. Next page starts after current videos
			if (lastPage.count === 5) {
				return lastPage.start + lastPage.count
			}
			return undefined // No more pages
		},
	})

	// Flatten all pages into a single videos array
	const videos: VideoWithMetadata[] =
		data?.pages.flatMap((page: { videos: VideoResponse[] }) => page.videos) ?? []

	const filteredVideos =
		selectedSubject === 'all'
			? videos
			: videos.filter((v) => v.subject === selectedSubject)

	const subjects = [
		'all',
		...Array.from(
			new Set(videos.map((v) => v.subject).filter((s): s is string => Boolean(s)))
		),
	]

	// Infinite scroll handler - load more when scrolling near bottom
	useEffect(() => {
		const scrollElement = scrollRef.current
		if (!scrollElement) return

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = scrollElement

			// Load more when we're within 3 screen heights of the bottom
			if (scrollHeight - scrollTop <= clientHeight * 3 && hasNextPage && !isFetching) {
				fetchNextPage()
			}
		}

		scrollElement.addEventListener('scroll', handleScroll)
		return () => scrollElement.removeEventListener('scroll', handleScroll)
	}, [hasNextPage, isFetching, fetchNextPage])

	// IntersectionObserver to detect which video is most visible
	useEffect(() => {
		const root = scrollRef.current
		if (!root) return

		const observer = new IntersectionObserver(
			(entries) => {
				let bestIndex = activeIndex
				let bestRatio = 0

				entries.forEach((entry) => {
					const idx = videoContainersRef.current.findIndex(
						(el) => el === entry.target
					)
					if (idx !== -1 && entry.intersectionRatio > bestRatio) {
						bestRatio = entry.intersectionRatio
						bestIndex = idx
					}
				})

				if (bestRatio > 0 && bestIndex !== activeIndex) {
					setActiveIndex(bestIndex)
				}
			},
			{
				root,
				threshold: [0.4, 0.6, 0.8], // tune sensitivity
			}
		)

		// Observe all current video containers
		videoContainersRef.current.forEach((el) => {
			if (el) observer.observe(el)
		})

		return () => observer.disconnect()
		// Re-run when number of filtered videos changes
	}, [filteredVideos.length, activeIndex])

	return (
		<div className="h-screen bg-black overflow-hidden flex flex-col">
			<TopNav variant="app" onCreateClick={() => setIsCreateModalOpen(true)} />

			{/* Subject Filter */}
			{videos.length > 0 && (
				<div className="z-40 bg-white/95 backdrop-blur-sm border-b border-gray-300 shadow-sm shrink-0">
					<SubjectFilter
						subjects={subjects}
						selectedSubject={selectedSubject}
						onSelectSubject={setSelectedSubject}
					/>
				</div>
			)}

			{/* Video Feed - TikTok / Instagram Reels style */}
			<main
				ref={scrollRef}
				className="flex-1 overflow-y-scroll snap-y snap-mandatory"
				style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
			>
				{status === 'pending' ? (
					<div className="h-full flex items-center justify-center">
						<div className="text-center">
							<Loader2 className="h-12 w-12 text-indigo-500 animate-spin mx-auto mb-4" />
							<p className="text-white text-lg">Loading videos...</p>
						</div>
					</div>
				) : status === 'error' ? (
					<div className="h-full flex items-center justify-center">
						<div className="text-center py-20 px-4">
							<VideoIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-white mb-2">
								Failed to load videos
							</h3>
							<p className="text-gray-400 mb-6">
								{(error as Error)?.message ?? 'Unknown error'}
							</p>
							<Button
								onClick={() => window.location.reload()}
								className="bg-indigo-600 hover:bg-indigo-700 text-white"
							>
								Try Again
							</Button>
						</div>
					</div>
				) : filteredVideos.length > 0 ? (
					<>
						{filteredVideos.map((video, index) => (
							<div
								key={video.id}
								ref={(el) => {
									videoContainersRef.current[index] = el
								}}
								className="h-full snap-start snap-always flex items-center justify-center"
							>
								<VideoPlayer
									ref={(instance) => {
										videoRefs.current[index] = instance
									}}
									video={video}
									isVisible={index === activeIndex}
									shouldBeMuted={index !== activeIndex}
								/>
							</div>
						))}

						{isFetchingNextPage && (
							<div className="h-full snap-start flex items-center justify-center">
								<Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
							</div>
						)}
					</>
				) : (
					<div className="h-full snap-start flex items-center justify-center">
						<div className="text-center py-20 px-4">
							<VideoIcon className="h-16 w-16 text-indigo-300 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-white mb-2">
								{selectedSubject === 'all'
									? 'No videos yet'
									: `No videos in ${selectedSubject}`}
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
