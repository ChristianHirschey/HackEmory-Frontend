'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Sparkles } from 'lucide-react'

type GameplayStyle = 'subway' | 'minecraft'

const exampleVideos = [
	{
		id: 1,
		title: 'The French Revolution Explained',
		thumbnail: '/world-war-2-history.jpg',
		views: '2.3M views',
	},
	{
		id: 2,
		title: 'Photosynthesis in 60 Seconds',
		thumbnail: '/photosynthesis-biology-plant.jpg',
		views: '1.8M views',
	},
	{
		id: 3,
		title: 'Why Shakespeare Still Matters',
		thumbnail: '/shakespeare-hamlet-literature.jpg',
		views: '945K views',
	},
]

export default function LandingPage() {
	const [selectedStyle, setSelectedStyle] = useState<GameplayStyle>('subway')
	const [isHovering, setIsHovering] = useState(false)
	const [hoveredVideo, setHoveredVideo] = useState<number | null>(null)

	return (
		<div
			className="min-h-screen relative overflow-hidden"
			style={{
				background: 'linear-gradient(135deg, #1a1410 0%, #2d1f1a 25%, #1f1815 50%, #261c17 75%, #1a1410 100%)',
			}}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
		>
			{/* Ambient light effects */}
			<div
				className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none"
				style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
			/>
			<div
				className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] pointer-events-none"
				style={{ background: 'radial-gradient(circle, #ea580c 0%, transparent 70%)' }}
			/>

			{/* Subtle noise texture overlay */}
			<div
				className="absolute inset-0 opacity-[0.03] pointer-events-none"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
				}}
			/>

			{/* Peter Griffin - Left Edge */}
			<div
				className="fixed left-0 top-1/2 -translate-y-1/2 z-20 hidden lg:block animate-float-peter"
			>
				<div className="relative group">
					{/* Peter's thought bubble */}
					<div
						className={`absolute -top-24 left-48 transition-all duration-500 ${
							isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
						}`}
					>
						<div className="relative bg-amber-50 text-stone-800 px-5 py-3 rounded-2xl shadow-lg max-w-[200px]">
							<p className="text-sm font-medium" style={{ fontFamily: 'Georgia, serif' }}>
								"Hehehehe, this is better than that time I explained quantum physics..."
							</p>
							{/* Bubble tail dots */}
							<div className="absolute -bottom-3 left-6 w-3 h-3 bg-amber-50 rounded-full" />
							<div className="absolute -bottom-6 left-4 w-2 h-2 bg-amber-50 rounded-full" />
						</div>
					</div>

					<Image
						src="/characters/peter.png"
						alt="Peter Griffin"
						width={350}
						height={450}
						className="drop-shadow-2xl transition-transform duration-300 hover:scale-105"
						style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.5))' }}
						priority
					/>
				</div>
			</div>

			{/* Stewie - Bottom Right */}
			<div
				className="fixed bottom-0 right-8 z-20 hidden lg:block animate-float-stewie"
			>
				<div className="relative group">
					{/* Stewie's thought bubble */}
					<div
						className={`absolute -top-20 right-32 transition-all duration-500 ${
							isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
						}`}
						style={{ transitionDelay: '100ms' }}
					>
						<div className="relative bg-amber-50 text-stone-800 px-5 py-3 rounded-2xl shadow-lg max-w-[220px]">
							<p className="text-sm font-medium" style={{ fontFamily: 'Georgia, serif' }}>
								"Victory shall be mine! And by victory, I mean... engagement metrics."
							</p>
							{/* Bubble tail dots */}
							<div className="absolute -bottom-3 right-8 w-3 h-3 bg-amber-50 rounded-full" />
							<div className="absolute -bottom-6 right-10 w-2 h-2 bg-amber-50 rounded-full" />
						</div>
					</div>

					<Image
						src="/characters/stewie.png"
						alt="Stewie Griffin"
						width={220}
						height={280}
						className="drop-shadow-2xl transition-transform duration-300 hover:scale-105"
						style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.5))' }}
						priority
					/>
				</div>
			</div>

			{/* Main Content */}
			<main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-20">
				<div className="max-w-2xl mx-auto text-center space-y-10">

					{/* Headline */}
					<div className="space-y-4">
						<h1
							className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight font-[family-name:var(--font-playfair)]"
							style={{
								color: '#fef3c7',
								textShadow: '0 4px 30px rgba(251, 191, 36, 0.3)',
							}}
						>
							Generate
							<br />
							<span
								className="relative inline-block"
								style={{
									background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #dc2626 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
								}}
							>
								Brainrot
								<Sparkles
									className="absolute -top-2 -right-8 w-6 h-6 text-amber-400 animate-pulse"
								/>
							</span>
						</h1>

						<p
							className="text-lg md:text-xl max-w-md mx-auto leading-relaxed"
							style={{
								color: '#d6d3d1',
								fontFamily: 'Georgia, serif',
							}}
						>
							Turn any content into chaotic education.
							<br />
							<span className="text-amber-400/80">Peter & Stewie explain it all.</span>
						</p>
					</div>

					{/* Style Selector */}
					<div className="flex flex-col items-center gap-3">
						<span
							className="text-sm uppercase tracking-widest"
							style={{ color: '#a8a29e' }}
						>
							Choose your backdrop
						</span>
						<div className="flex gap-2 p-1.5 rounded-full bg-stone-900/50 backdrop-blur-sm border border-stone-700/50">
							<button
								onClick={() => setSelectedStyle('subway')}
								className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
									selectedStyle === 'subway'
										? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-900 shadow-lg shadow-amber-500/25'
										: 'text-stone-400 hover:text-stone-200'
								}`}
							>
								Subway Surfers
							</button>
							<button
								onClick={() => setSelectedStyle('minecraft')}
								className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
									selectedStyle === 'minecraft'
										? 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-900 shadow-lg shadow-amber-500/25'
										: 'text-stone-400 hover:text-stone-200'
								}`}
							>
								Minecraft
							</button>
						</div>
					</div>

					{/* Example Videos */}
					<div className="space-y-4">
						<span
							className="text-sm uppercase tracking-widest block"
							style={{ color: '#a8a29e' }}
						>
							Recent creations
						</span>
						<div className="flex gap-4 justify-center">
							{exampleVideos.map((video) => (
								<button
									key={video.id}
									className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20"
									style={{
										width: '140px',
										aspectRatio: '9/16',
									}}
									onMouseEnter={() => setHoveredVideo(video.id)}
									onMouseLeave={() => setHoveredVideo(null)}
								>
									<Image
										src={video.thumbnail}
										alt={video.title}
										fill
										className="object-cover"
									/>
									{/* Overlay */}
									<div
										className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${
											hoveredVideo === video.id ? 'opacity-100' : 'opacity-70'
										}`}
									/>
									{/* Play button */}
									<div
										className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
											hoveredVideo === video.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
										}`}
									>
										<div className="w-12 h-12 rounded-full bg-amber-500/90 flex items-center justify-center shadow-lg">
											<Play className="w-5 h-5 text-stone-900 ml-0.5" fill="currentColor" />
										</div>
									</div>
									{/* Info */}
									<div className="absolute bottom-0 left-0 right-0 p-3 text-left">
										<p
											className="text-xs font-medium text-white leading-tight line-clamp-2"
											style={{ fontFamily: 'Georgia, serif' }}
										>
											{video.title}
										</p>
										<p className="text-[10px] text-stone-400 mt-1">
											{video.views}
										</p>
									</div>
								</button>
							))}
						</div>
					</div>

					{/* CTA Button */}
					<div className="pt-4">
						<Link href="/create">
							<Button
								size="lg"
								className="group relative px-10 py-7 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl"
								style={{
									background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
									color: '#1a1410',
									boxShadow: '0 20px 50px -12px rgba(245, 158, 11, 0.4)',
								}}
							>
								<span className="relative z-10">Generate My Own</span>
								<div
									className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
									style={{
										background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
									}}
								/>
							</Button>
						</Link>
					</div>
				</div>
			</main>

			{/* Subtle footer */}
			<footer className="absolute bottom-4 left-0 right-0 text-center z-10">
				<p
					className="text-xs"
					style={{ color: '#57534e' }}
				>
					the output is brainrot. the experience is not.
				</p>
			</footer>
		</div>
	)
}
