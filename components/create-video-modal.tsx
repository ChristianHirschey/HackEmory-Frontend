'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, LinkIcon, Sparkles } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface CreateVideoModalProps {
	isOpen: boolean
	onClose: () => void
}

export function CreateVideoModal({ isOpen, onClose }: CreateVideoModalProps) {
	const [youtubeUrl, setYoutubeUrl] = useState('')
	const [file, setFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)
	const [activeTab, setActiveTab] = useState('youtube')

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0])
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// Validate that we have either a URL or file
		if (!youtubeUrl && !file) {
			alert('Please provide a YouTube URL or upload a file')
			return
		}

		setLoading(true)

		try {
			const formData = new FormData()

			// Add input_type (auto-detect)
			formData.append('input_type', 'auto')

			// Add user_id (you might want to get this from auth context)
			formData.append('user_id', '1')

			if (activeTab === 'youtube' && youtubeUrl) {
				// For YouTube, send as 'content'
				formData.append('content', youtubeUrl)
			} else if (activeTab === 'upload' && file) {
				// For file upload, send as 'file'
				formData.append('file', file)
			}

			// Send to backend
			const response = await fetch('http://localhost:8000/generate-video', {
				method: 'POST',
				body: formData,
				credentials: 'include',
			})

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}))
				throw new Error(errorData.detail || 'Failed to generate video')
			}

			const data = await response.json()
			console.log('✓ Video generation started:', data)
			console.log(`✓ Generated ${data.count} videos`)

			setYoutubeUrl('')
			setFile(null)
			onCreated()
			onClose()
		} catch (error) {
			console.error('Error generating video:', error)
			const errorMessage = error instanceof Error ? error.message : 'Failed to generate video. Please try again.'
			alert(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800 text-white">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold flex items-center gap-2">
						<Sparkles className="h-6 w-6 text-indigo-500" />
						Generate Video
					</DialogTitle>
					<DialogDescription className="text-gray-400">
						Provide a source and we'll generate your video
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6 mt-4">
					{/* Content Source */}
					<div className="space-y-2">
						<Label className="text-white">Source</Label>
						<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
							<TabsList className="grid w-full grid-cols-2 bg-gray-800">
								<TabsTrigger value="youtube" className="data-[state=active]:bg-indigo-600">
									<LinkIcon className="h-4 w-4 mr-2" />
									YouTube URL
								</TabsTrigger>
								<TabsTrigger value="upload" className="data-[state=active]:bg-indigo-600">
									<Upload className="h-4 w-4 mr-2" />
									Upload File
								</TabsTrigger>
							</TabsList>

							<TabsContent value="youtube" className="space-y-3 mt-4">
								<Input
									placeholder="https://youtube.com/watch?v=..."
									value={youtubeUrl}
									onChange={(e) => setYoutubeUrl(e.target.value)}
									className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
								/>
								<p className="text-sm text-gray-400">
									Paste a YouTube URL to generate a video
								</p>
							</TabsContent>

							<TabsContent value="upload" className="space-y-3 mt-4">
								<div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer">
									<input
										type="file"
										id="file-upload"
										onChange={handleFileChange}
										accept=".mp4,.mov,.avi,.pdf,.txt,.doc,.docx"
										className="hidden"
									/>
									<label htmlFor="file-upload" className="cursor-pointer">
										<Upload className="h-12 w-12 text-gray-500 mx-auto mb-3" />
										{file ? (
											<div>
												<p className="text-white font-medium">{file.name}</p>
												<p className="text-sm text-gray-400 mt-1">
													{(file.size / 1024 / 1024).toFixed(2)} MB
												</p>
											</div>
										) : (
											<div>
												<p className="text-white font-medium">Click to upload</p>
												<p className="text-sm text-gray-400 mt-1">
													Video, PDF, or text file
												</p>
											</div>
										)}
									</label>
								</div>
							</TabsContent>
						</Tabs>
					</div>

					{/* Actions */}
					<div className="flex gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
							disabled={loading}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
							disabled={loading}
						>
							{loading ? (
								<span className="flex items-center gap-2">
									<span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									Generating...
								</span>
							) : (
								<span className="flex items-center gap-2">
									<Sparkles className="h-4 w-4" />
									Generate Video
								</span>
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
