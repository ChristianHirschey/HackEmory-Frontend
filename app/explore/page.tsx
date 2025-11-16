'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Video as VideoIcon, Loader2, ArrowLeft } from 'lucide-react'
import { TopNav } from '@/components/TopNavBar'
import { fetchCollections, CollectionSummary } from '@/lib/api'

export default function ExplorePage() {
	const {
		data: collectionsData,
		error,
		status,
	} = useQuery({
		queryKey: ['collections'],
		queryFn: fetchCollections,
	})

	const collections = collectionsData?.collections ?? []

	return (
		<div className="min-h-screen bg-black">
			<TopNav variant="app" />

			<div className="container mx-auto px-4 pt-20 pb-12">
				{/* Header */}
				<div className="mb-8 flex items-center gap-4">
					<Link href="/feed">
						<Button
							variant="ghost"
							className="text-gray-300 hover:text-white hover:bg-gray-800"
						>
							<ArrowLeft className="h-5 w-5 mr-2" />
							Back to Feed
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold text-white mb-2">Explore Collections</h1>
						<p className="text-gray-400">
							Discover all available collections
						</p>
					</div>
				</div>

				{/* Loading State */}
				{status === 'pending' && (
					<div className="flex items-center justify-center py-20">
						<div className="text-center">
							<Loader2 className="h-12 w-12 text-indigo-500 animate-spin mx-auto mb-4" />
							<p className="text-white text-lg">Loading collections...</p>
						</div>
					</div>
				)}

				{/* Error State */}
				{status === 'error' && (
					<div className="flex items-center justify-center py-20">
						<div className="text-center">
							<VideoIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-white mb-2">
								Failed to load collections
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
				)}

				{/* Collections Grid - Instagram Explore Style */}
				{status === 'success' && collections.length > 0 && (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
						{collections.map((collection) => (
							<Link
								key={collection.id}
								href={`/feed?collection=${collection.id}`}
								className="group"
							>
								<div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-800 hover:border-indigo-500 transition-all duration-200">
									{/* Gradient Overlay */}
									<div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 group-hover:from-indigo-600/40 group-hover:to-purple-600/40 transition-all duration-200" />
									
									{/* Content */}
									<div className="absolute inset-0 flex flex-col items-center justify-center p-4">
										<VideoIcon className="h-12 w-12 text-white mb-3 group-hover:scale-110 transition-transform duration-200" />
										<h3 className="text-white font-semibold text-center text-sm md:text-base line-clamp-2">
											{collection.title}
										</h3>
									</div>

									{/* Hover Effect */}
									<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />
								</div>
							</Link>
						))}
					</div>
				)}

				{/* Empty State */}
				{status === 'success' && collections.length === 0 && (
					<div className="flex items-center justify-center py-20">
						<div className="text-center">
							<VideoIcon className="h-16 w-16 text-indigo-300 mx-auto mb-4" />
							<h3 className="text-xl font-semibold text-white mb-2">
								No collections yet
							</h3>
							<p className="text-gray-400 mb-6">
								Collections will appear here once they're created
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

