'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronDown,
  ImagePlus,
  Trash2,
  X,
  Settings2,
} from 'lucide-react'
import { ImageSize, ImagePosition, ImageConfig, DialogueLine } from '@/lib/types'
import {
  getSizeLabel,
  getPositionLabel,
  canAddMoreImages,
  getAvailablePositions,
  getPositionsForSize,
} from '@/lib/image-positions'
import { ImageUploadFlow } from './ImageUploadFlow'
import { cn } from '@/lib/utils'

interface ImageLineManagerProps {
  line: DialogueLine
  lineIdx: number
  /** Previous line for detecting continued dialogue */
  previousLine?: DialogueLine
  /** Total number of dialogue lines (for span feature) */
  totalLines?: number
  /** Preview URLs for images (filename -> url) */
  previewUrls: Map<string, string>
  /** Add a new image to this line */
  onAddImage: (file: File, size: ImageSize, position: ImagePosition) => void
  /** Remove an image by index */
  onRemoveImage: (imageIdx: number) => void
  /** Update image config */
  onUpdateImage: (imageIdx: number, updates: Partial<ImageConfig>) => void
  /** Update caption */
  onUpdateCaption?: (caption: string) => void
  /** Calculate duration from lineIdx to targetLineIdx (for image spanning) */
  calculateSpanDuration?: (startLineIdx: number, endLineIdx: number) => number
}

export function ImageLineManager({
  line,
  lineIdx,
  previousLine,
  totalLines = 0,
  previewUrls,
  onAddImage,
  onRemoveImage,
  onUpdateImage,
  onUpdateCaption,
  calculateSpanDuration,
}: ImageLineManagerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [editingImageIdx, setEditingImageIdx] = useState<number | null>(null)

  // Check if this line is a "continued" dialogue (same speaker/emotion as previous)
  const isContinued = previousLine && 
    previousLine.speaker === line.speaker && 
    previousLine.emotion === line.emotion

  // Get all images for this line (combine image and images)
  const allImages: ImageConfig[] = []
  if (line.images && line.images.length > 0) {
    allImages.push(...line.images)
  } else if (line.image) {
    allImages.push(line.image)
  }

  const { canAdd, allowedSizes } = canAddMoreImages(allImages)
  const hasImages = allImages.length > 0

  return (
    <div className="bg-gray-850 border border-gray-700 rounded-lg overflow-hidden">
      {/* Line Header */}
      <div className="p-3">
        <div className="flex items-start gap-3">
          {/* Line Number */}
          <span className="text-xs text-gray-500 font-mono w-6 text-right shrink-0">
            {lineIdx + 1}
          </span>

          {/* Speaker Badge */}
          <div className="flex items-center gap-1 shrink-0">
            {isContinued && (
              <span className="text-xs text-gray-500">↳</span>
            )}
            <span
              className={cn(
                'px-2 py-0.5 text-xs font-medium rounded',
                line.speaker === 'PETER'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-purple-500/20 text-purple-400'
              )}
            >
              {line.speaker}
            </span>
          </div>

          {/* Caption */}
          <p className="flex-1 text-sm text-gray-300 line-clamp-2">{line.caption}</p>

          {/* Image Indicator / Add Button */}
          {hasImages ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded hover:bg-indigo-500/30 transition-colors"
            >
              <ImagePlus className="h-3 w-3" />
              {allImages.length} Image{allImages.length > 1 ? 's' : ''}
              <ChevronDown
                className={cn('h-3 w-3 transition-transform', isExpanded && 'rotate-180')}
              />
            </button>
          ) : (
            <button
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-1 px-2 py-1 text-gray-500 text-xs rounded border border-gray-700 hover:border-indigo-500 hover:text-indigo-400 transition-colors"
            >
              <ImagePlus className="h-3 w-3" />
              Add Image
            </button>
          )}
        </div>

        {line.duration_estimate && (
          <span className="text-xs text-gray-500 mt-1 block ml-9">
            ~{line.duration_estimate.toFixed(1)}s
          </span>
        )}
      </div>

      {/* Expanded Image List */}
      {hasImages && isExpanded && (
        <div className="px-3 pb-3 pt-2 border-t border-gray-700 bg-gray-900/50 space-y-3">
          {allImages.map((img, imgIdx) => (
            <ImageCard
              key={`${img.filename}-${imgIdx}`}
              image={img}
              imageIdx={imgIdx}
              lineIdx={lineIdx}
              totalLines={totalLines}
              previewUrl={previewUrls.get(img.filename)}
              isEditing={editingImageIdx === imgIdx}
              onEdit={() => setEditingImageIdx(editingImageIdx === imgIdx ? null : imgIdx)}
              onRemove={() => onRemoveImage(imgIdx)}
              onUpdate={(updates) => onUpdateImage(imgIdx, updates)}
              allImages={allImages}
              calculateSpanDuration={calculateSpanDuration}
            />
          ))}

          {/* Add Another Button */}
          {canAdd && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUploadOpen(true)}
              className="w-full border-dashed border-gray-700 text-gray-400 hover:text-indigo-400 hover:border-indigo-500"
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Add Another Image
              <span className="ml-2 text-xs text-gray-500">
                ({allowedSizes.join(', ')} available)
              </span>
            </Button>
          )}
        </div>
      )}

      {/* Upload Flow Dialog */}
      <ImageUploadFlow
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onComplete={(file, size, position) => {
          onAddImage(file, size, position)
          setIsUploadOpen(false)
          setIsExpanded(true)
        }}
        currentImages={allImages}
        previewUrls={previewUrls}
      />
    </div>
  )
}

// ============ ImageCard Sub-component ============

interface ImageCardProps {
  image: ImageConfig
  imageIdx: number
  lineIdx: number
  totalLines: number
  previewUrl?: string
  isEditing: boolean
  onEdit: () => void
  onRemove: () => void
  onUpdate: (updates: Partial<ImageConfig>) => void
  allImages: ImageConfig[]
  calculateSpanDuration?: (startLineIdx: number, endLineIdx: number) => number
}

function ImageCard({
  image,
  imageIdx,
  lineIdx,
  totalLines,
  previewUrl,
  isEditing,
  onEdit,
  onRemove,
  onUpdate,
  allImages,
  calculateSpanDuration,
}: ImageCardProps) {
  const [spanMode, setSpanMode] = useState<'manual' | 'line-range'>('manual')
  const [spanUntilLine, setSpanUntilLine] = useState<number>(lineIdx)

  // Get available positions for this size (excluding positions used by other images)
  const usedPositions = allImages
    .filter((_, idx) => idx !== imageIdx)
    .map((img) => img.position)
    .filter(Boolean) as ImagePosition[]

  const allPositionsForSize = getPositionsForSize(image.size)
  const availablePositions = allPositionsForSize.filter(
    (pos) => !usedPositions.includes(pos) || pos === image.position
  )

  // Handle span line change
  const handleSpanLineChange = (targetLine: number) => {
    setSpanUntilLine(targetLine)
    if (calculateSpanDuration) {
      const duration = calculateSpanDuration(lineIdx, targetLine)
      onUpdate({ duration })
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-3">
      <div className="flex items-start gap-3">
        {/* Preview Thumbnail */}
        {previewUrl && (
          <div className="w-16 h-16 rounded overflow-hidden bg-gray-700 shrink-0">
            <img
              src={previewUrl}
              alt={image.filename}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Image Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white truncate max-w-[150px]">
              {image.filename}
            </span>
            <button
              onClick={onRemove}
              className="p-1 text-gray-500 hover:text-red-400 transition-colors"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-1">
            {/* Size Badge */}
            <span
              className={cn(
                'px-2 py-0.5 text-xs rounded',
                image.size === 'small' && 'bg-green-500/20 text-green-400',
                image.size === 'medium' && 'bg-blue-500/20 text-blue-400',
                image.size === 'large' && 'bg-purple-500/20 text-purple-400'
              )}
            >
              {getSizeLabel(image.size, image.position)}
            </span>

            {/* Position Badge */}
            {image.position && (
              <span className="px-2 py-0.5 text-xs bg-gray-700 text-gray-300 rounded">
                {getPositionLabel(image.position)}
              </span>
            )}
          </div>

          {/* Timing Summary */}
          <p className="text-xs text-gray-500 mt-1">
            {image.start_time ? `Starts at ${image.start_time}s` : 'Starts immediately'} •{' '}
            {image.duration ? `Shows for ${image.duration}s` : 'Shows for full line'}
          </p>
        </div>

        {/* Edit Toggle */}
        <button
          onClick={onEdit}
          className={cn(
            'p-1.5 rounded transition-colors',
            isEditing
              ? 'bg-indigo-500/20 text-indigo-400'
              : 'text-gray-500 hover:text-gray-300'
          )}
          title="Edit settings"
        >
          <Settings2 className="h-4 w-4" />
        </button>
      </div>

      {/* Editing Controls */}
      {isEditing && (
        <div className="mt-3 pt-3 border-t border-gray-700 space-y-3">
          {/* Position Row */}
          <div className="grid grid-cols-3 gap-3">
            {/* Position */}
            <div>
              <Label className="text-xs text-gray-500">Position</Label>
              <Select
                value={image.position || undefined}
                onValueChange={(v) => onUpdate({ position: v as ImagePosition })}
              >
                <SelectTrigger className="h-8 text-xs bg-gray-900 border-gray-700">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {availablePositions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {getPositionLabel(pos)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Time */}
            <div>
              <Label className="text-xs text-gray-500">Start (s)</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={image.start_time ?? ''}
                onChange={(e) =>
                  onUpdate({
                    start_time: e.target.value === '' ? undefined : Number(e.target.value),
                  })
                }
                placeholder="0"
                className="h-8 text-xs bg-gray-900 border-gray-700"
              />
            </div>

            {/* Empty cell for alignment */}
            <div />
          </div>

          {/* Duration Mode Toggle */}
          <div>
            <Label className="text-xs text-gray-500 mb-2 block">Duration</Label>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setSpanMode('manual')}
                className={cn(
                  'px-3 py-1.5 text-xs rounded transition-colors',
                  spanMode === 'manual'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-300'
                )}
              >
                Manual (seconds)
              </button>
              <button
                onClick={() => setSpanMode('line-range')}
                className={cn(
                  'px-3 py-1.5 text-xs rounded transition-colors',
                  spanMode === 'line-range'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-300'
                )}
              >
                Span Lines
              </button>
            </div>

            {/* Duration Input Based on Mode */}
            {spanMode === 'manual' ? (
              <div className="w-32">
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={image.duration ?? ''}
                  onChange={(e) =>
                    onUpdate({
                      duration: e.target.value === '' ? undefined : Number(e.target.value),
                    })
                  }
                  placeholder="Auto"
                  className="h-8 text-xs bg-gray-900 border-gray-700"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Show from line {lineIdx + 1} until:</span>
                <Select
                  value={String(spanUntilLine)}
                  onValueChange={(v) => handleSpanLineChange(Number(v))}
                >
                  <SelectTrigger className="w-32 h-8 text-xs bg-gray-900 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: Math.max(1, totalLines - lineIdx) }, (_, i) => lineIdx + i).map((idx) => (
                      <SelectItem key={idx} value={String(idx)}>
                        Line {idx + 1}
                        {idx === lineIdx && ' (this line)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {image.duration && (
                  <span className="text-xs text-indigo-400">
                    ({image.duration.toFixed(1)}s)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
