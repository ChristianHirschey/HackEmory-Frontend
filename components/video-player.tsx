'use client'

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Video {
  id: string
  title: string
  description: string
  presigned_url: string
  subject?: string
  thumbnail?: string
  character?: string
  duration?: string
}

interface VideoPlayerProps {
  video: Video
  isVisible?: boolean
  shouldBeMuted?: boolean
}

export interface VideoPlayerRef {
  play: () => void
  pause: () => void
  getVideoElement: () => HTMLVideoElement | null
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({ video, isVisible = false, shouldBeMuted = true }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false) // Start unmuted
  const videoRef = useRef<HTMLVideoElement>(null)
  const playPromiseRef = useRef<Promise<void> | null>(null)
  const prevIsVisible = useRef<boolean | null>(null)
  const hasStarted = useRef(false)

  // Expose play/pause methods to parent
  useImperativeHandle(ref, () => ({
    play: () => {
      if (videoRef.current && !isPlaying) {
        videoRef.current.play()
        setIsPlaying(true)
      }
    },
    pause: () => {
      if (videoRef.current && isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    },
    getVideoElement: () => videoRef.current
  }))

  // Simple cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted
      videoRef.current.muted = newMutedState
      setIsMuted(newMutedState)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      }
    }
  }

  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl w-full max-w-md h-[85vh]">
      {/* Video Container with TikTok aspect ratio */}
      <div className="relative w-full h-full bg-black">
        {/* Video Element */}
        <video
          ref={videoRef}
          id={`video-${video.id}`}
          src={video.presigned_url}
          poster={video.thumbnail || "/placeholder.svg"}
          className="w-full h-full object-cover"
          loop
          playsInline
          preload="metadata"
          onClick={togglePlay}
        />

        {/* Play/Pause Overlay */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-transparent hover:bg-black/10 transition-colors"
        >
          {!isPlaying && (
            <div className="h-20 w-20 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
              <Play className="h-10 w-10 text-gray-900 ml-1" />
            </div>
          )}
        </button>

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 space-y-3">
          {/* Video Info */}
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-white text-balance leading-tight">
              {video.title}
            </h3>
            <p className="text-sm text-gray-300 line-clamp-2">
              {video.description}
            </p>
            {(video.subject || video.character || video.duration) && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                {video.subject && (
                  <>
                    <span className="bg-indigo-600 px-2 py-0.5 rounded-full text-xs font-medium">
                      {video.subject}
                    </span>
                    <span>•</span>
                  </>
                )}
                {video.character && (
                  <>
                    <span>Voiced by {video.character}</span>
                    {video.duration && <span>•</span>}
                  </>
                )}
                {video.duration && <span>{video.duration}</span>}
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={togglePlay}
              size="icon"
              variant="ghost"
              className="h-10 w-10 text-white hover:bg-white/20"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <Button
              onClick={toggleMute}
              size="icon"
              variant="ghost"
              className="h-10 w-10 text-white hover:bg-white/20"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>

            <Button
              onClick={toggleFullscreen}
              size="icon"
              variant="ghost"
              className="h-10 w-10 text-white hover:bg-white/20 ml-auto"
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
})

VideoPlayer.displayName = 'VideoPlayer'

