'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload, LinkIcon, Sparkles, FileText } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface CreateVideoModalProps {
	isOpen: boolean
	onClose: () => void
}

export function CreateVideoModal({ isOpen, onClose }: CreateVideoModalProps) {
	const [youtubeUrl, setYoutubeUrl] = useState('')
	const [textContent, setTextContent] = useState('')
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

		// Validate that we have either a URL, text, or file
		if (!youtubeUrl && !textContent && !file) {
			alert('Please provide a YouTube URL, text content, or upload a file')
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
			} else if (activeTab === 'text' && textContent) {
				// For text, send as 'content'
				formData.append('content', textContent)
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

			// Reset form
			setYoutubeUrl('')
			setTextContent('')
			setFile(null)
			alert(`Successfully generated ${data.count} video(s)!`)
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
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] bg-gray-900 border-gray-800 text-white overflow-hidden flex flex-col">
				<DialogHeader className="flex-shrink-0">
					<DialogTitle className="text-2xl font-bold flex items-center gap-2">
						<Sparkles className="h-6 w-6 text-indigo-500" />
						Generate Video
					</DialogTitle>
					<DialogDescription className="text-gray-400">
						Provide a source and we'll generate your video
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6 mt-4 overflow-y-auto flex-1 pr-2 pb-4">
					{/* Content Source */}
					<div className="space-y-2">
						<Label className="text-white">Source</Label>
						<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
							<TabsList className="grid w-full grid-cols-3 bg-gray-800">
								<TabsTrigger value="youtube" className="data-[state=active]:bg-indigo-600">
									<LinkIcon className="h-4 w-4 mr-2" />
									YouTube
								</TabsTrigger>
								<TabsTrigger value="text" className="data-[state=active]:bg-indigo-600">
									<FileText className="h-4 w-4 mr-2" />
									Text
								</TabsTrigger>
								<TabsTrigger value="upload" className="data-[state=active]:bg-indigo-600">
									<Upload className="h-4 w-4 mr-2" />
									Upload
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

							<TabsContent value="text" className="space-y-3 mt-4">
								<Textarea
									placeholder="Enter your text content here..."
									value={textContent}
									onChange={(e) => setTextContent(e.target.value)}
									className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 min-h-[200px] resize-none"
								/>
								<p className="text-sm text-gray-400">
									Paste or type text to generate a video
								</p>
							</TabsContent>

							<TabsContent value="upload" className="space-y-3 mt-4">
								<div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer">
									<input
										type="file"
										id="file-upload"
										onChange={handleFileChange}
										accept=".mp4,.mov,.avi,.pdf,.txt,.doc,.docx,.mp3"
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
													Audio, video, PDF, or text file
												</p>
											</div>
										)}
									</label>
								</div>
							</TabsContent>
						</Tabs>
					</div>

				</form>
				
				{/* Actions - Fixed at bottom */}
				<div className="flex gap-3 pt-4 border-t border-gray-800 mt-4 flex-shrink-0">
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
						onClick={handleSubmit}
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
			</DialogContent>
		</Dialog>
	)
}
