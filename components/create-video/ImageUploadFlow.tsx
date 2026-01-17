'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Upload, X, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { ImageSize, ImagePosition, ImageConfig } from '@/lib/types'
import {
  getPositionsForSize,
  getDefaultPosition,
  getSizeLabel,
  getPositionLabel,
  canAddMoreImages,
  getAvailablePositions,
} from '@/lib/image-positions'
import { ImagePositionGrid } from './ImagePositionGrid'

interface ImageUploadFlowProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (file: File, size: ImageSize, position: ImagePosition) => void
  /** Existing images on this line (for limit checking) */
  currentImages: ImageConfig[]
  /** Preview URLs for existing images */
  previewUrls: Map<string, string>
}

type FlowStep = 'size' | 'upload' | 'position'

export function ImageUploadFlow({
  isOpen,
  onClose,
  onComplete,
  currentImages,
  previewUrls,
}: ImageUploadFlowProps) {
  const [step, setStep] = useState<FlowStep>('size')
  const [selectedSize, setSelectedSize] = useState<ImageSize | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<ImagePosition | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check what sizes are allowed
  const { allowedSizes } = canAddMoreImages(currentImages)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Create preview URL
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSizeSelect = (size: ImageSize) => {
    setSelectedSize(size)
    // Pre-select default position
    const defaultPos = getDefaultPosition(size)
    const available = getAvailablePositions(currentImages, size)
    if (available.includes(defaultPos)) {
      setSelectedPosition(defaultPos)
    } else if (available.length > 0) {
      setSelectedPosition(available[0])
    }
    setStep('upload')
  }

  const handlePositionSelect = (position: ImagePosition) => {
    setSelectedPosition(position)
  }

  const handleComplete = () => {
    if (selectedFile && selectedSize && selectedPosition) {
      onComplete(selectedFile, selectedSize, selectedPosition)
      handleReset()
    }
  }

  const handleReset = () => {
    setStep('size')
    setSelectedSize(null)
    setSelectedFile(null)
    setSelectedPosition(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    onClose()
  }

  const handleBack = () => {
    if (step === 'position') {
      setStep('upload')
    } else if (step === 'upload') {
      setStep('size')
      setSelectedFile(null)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
    }
  }

  // Available positions for selected size
  const availablePositions = selectedSize
    ? getAvailablePositions(currentImages, selectedSize)
    : []

  return (
    <Dialog open={isOpen} onOpenChange={handleReset}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-indigo-400" />
            Add Image
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {step === 'size' && 'Step 1: Choose image size'}
            {step === 'upload' && 'Step 2: Upload your image'}
            {step === 'position' && 'Step 3: Select position'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Step 1: Size Selection */}
          {step === 'size' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400 mb-4">
                Choose a size for your educational image:
              </p>
              <div className="grid grid-cols-3 gap-4">
                {(['small', 'medium', 'large'] as ImageSize[]).map((size) => {
                  const isAllowed = allowedSizes.includes(size)
                  return (
                    <button
                      key={size}
                      onClick={() => isAllowed && handleSizeSelect(size)}
                      disabled={!isAllowed}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isAllowed
                          ? 'border-gray-700 hover:border-indigo-500 hover:bg-gray-800 cursor-pointer'
                          : 'border-gray-800 bg-gray-800/50 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className={`text-lg font-semibold ${isAllowed ? 'text-white' : 'text-gray-500'}`}>
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {size === 'small' && '300px • Icons, small diagrams'}
                        {size === 'medium' && '540px • Charts, formulas'}
                        {size === 'large' && '800px • Main diagrams'}
                      </div>
                      {!isAllowed && (
                        <div className="text-xs text-red-400 mt-2">
                          Limit reached
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2: File Upload */}
          {step === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.gif"
                onChange={handleFileChange}
                className="hidden"
              />

              {!selectedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors cursor-pointer"
                >
                  <Upload className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-white font-medium">Click to upload</p>
                  <p className="text-sm text-gray-400 mt-1">
                    PNG, JPG, JPEG, or GIF (max 10MB)
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg">
                  {previewUrl && (
                    <div className="w-24 h-24 rounded overflow-hidden bg-gray-700 shrink-0">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{selectedFile.name}</p>
                    <p className="text-sm text-gray-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-sm text-indigo-400 mt-1">
                      Size: {getSizeLabel(selectedSize!)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null)
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl)
                        setPreviewUrl(null)
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Position Selection */}
          {step === 'position' && selectedSize && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                {previewUrl && (
                  <div className="w-16 h-16 rounded overflow-hidden bg-gray-700 shrink-0">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-white font-medium">{selectedFile?.name}</p>
                  <p className="text-sm text-indigo-400">{getSizeLabel(selectedSize)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Position dropdown */}
                <div>
                  <Label className="text-gray-400 text-sm mb-2 block">Position</Label>
                  <Select
                    value={selectedPosition || undefined}
                    onValueChange={(v) => setSelectedPosition(v as ImagePosition)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select position" />
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
              </div>

              {/* Visual Grid Preview */}
              <div className="mt-4">
                <Label className="text-gray-400 text-sm mb-2 block">Preview</Label>
                <ImagePositionGrid
                  currentImages={[
                    ...currentImages,
                    // Add pending image for preview
                    ...(selectedPosition ? [{
                      filename: selectedFile?.name || 'pending',
                      size: selectedSize,
                      position: selectedPosition,
                    }] : []),
                  ]}
                  previewUrls={new Map([
                    ...previewUrls,
                    ...(previewUrl && selectedFile ? [[selectedFile.name, previewUrl] as [string, string]] : []),
                  ])}
                  selectedSize={selectedSize}
                  onPositionSelect={handlePositionSelect}
                  interactive={true}
                  className="max-w-[250px] mx-auto"
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-800">
          {step !== 'size' && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}

          {step === 'size' && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
          )}

          {step === 'upload' && (
            <Button
              onClick={() => setStep('position')}
              disabled={!selectedFile}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Next: Choose Position
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}

          {step === 'position' && (
            <Button
              onClick={handleComplete}
              disabled={!selectedPosition}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
