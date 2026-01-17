'use client'

import { Progress } from '@/components/ui/progress'
import { Loader2 } from 'lucide-react'
import { ProgressUpdate } from '@/lib/types'
import { getStageDescription } from '@/lib/api'

interface ProgressDisplayProps {
  progress: ProgressUpdate | null
  step: 'transcript' | 'video'
}

export function ProgressDisplay({ progress, step }: ProgressDisplayProps) {
  const percentage = progress?.percentage ?? 0
  const stage = progress?.current_stage
  const message = progress?.message || getStageDescription(stage)

  const stepLabels = {
    transcript: 'Generating Transcript',
    video: 'Creating Video',
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-indigo-600/20 flex items-center justify-center mx-auto mb-6">
          <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {stepLabels[step]}
        </h2>
        <p className="text-gray-400">
          {step === 'transcript'
            ? 'Analyzing your content and creating a dialogue script'
            : 'Creating your educational video with AI-generated voices'}
        </p>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="text-indigo-400 font-medium">{percentage}%</span>
        </div>
        <Progress value={percentage} className="h-3" />
        <p className="text-sm text-gray-400 text-center">{message}</p>

        {/* Dialogue Title (Video step) */}
        {step === 'video' && progress?.dialogue_title && (
          <div className="pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              {progress.dialogue_title}
            </p>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-gray-500">
        This may take a few minutes. Please don't close this page.
      </p>
    </div>
  )
}
