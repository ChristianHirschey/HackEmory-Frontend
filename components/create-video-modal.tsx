'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, LinkIcon, Sparkles } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface CreateVideoModalProps {
  isOpen: boolean
  onClose: () => void
}

const CHARACTERS = [
  'Peter Griffin',
  'Stewie Griffin',
  'Brian Griffin',
  'Lois Griffin',
  'Meg Griffin',
  'Chris Griffin',
]

const SUBJECTS = [
  'Math',
  'Science',
  'History',
  'Literature',
  'Chemistry',
  'Physics',
  'Biology',
  'Geography',
  'Economics',
  'Computer Science',
]

export function CreateVideoModal({ isOpen, onClose }: CreateVideoModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subject, setSubject] = useState('')
  const [character, setCharacter] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate video creation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('[v0] Creating video:', {
      title,
      description,
      subject,
      character,
      youtubeUrl,
      file: file?.name,
    })

    // Reset form
    setTitle('')
    setDescription('')
    setSubject('')
    setCharacter('')
    setYoutubeUrl('')
    setFile(null)
    setLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-500" />
            Create AI Study Video
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Generate a study video narrated by your favorite Family Guy character. Upload content or provide a YouTube link.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">Video Title</Label>
              <Input
                id="title"
                placeholder="e.g., Introduction to Calculus"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what you want to learn about..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-white">Subject</Label>
                <Select value={subject} onValueChange={setSubject} required>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {SUBJECTS.map((subj) => (
                      <SelectItem key={subj} value={subj} className="text-white hover:bg-gray-700">
                        {subj}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="character" className="text-white">Voice Character</Label>
                <Select value={character} onValueChange={setCharacter} required>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select character" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {CHARACTERS.map((char) => (
                      <SelectItem key={char} value={char} className="text-white hover:bg-gray-700">
                        {char}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Content Source */}
          <div className="space-y-2">
            <Label className="text-white">Content Source</Label>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="upload" className="data-[state=active]:bg-indigo-600">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger value="youtube" className="data-[state=active]:bg-indigo-600">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  YouTube Link
                </TabsTrigger>
              </TabsList>

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
                          Video, PDF, or text file (Max 100MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </TabsContent>

              <TabsContent value="youtube" className="space-y-3 mt-4">
                <Input
                  placeholder="https://youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
                <p className="text-sm text-gray-400">
                  Paste a YouTube URL and we'll extract the content to create your study video.
                </p>
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
