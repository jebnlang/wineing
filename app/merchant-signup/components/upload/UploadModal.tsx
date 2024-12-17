'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../../../../components/ui/dialog'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs'
import { Upload } from 'lucide-react'

interface UploadModalProps {
  onUpload: (data: {
    type: 'image' | 'link'
    url: string
  }) => Promise<void>
}

export function UploadModal({ onUpload }: UploadModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (type: 'image' | 'link') => {
    if (!url) {
      setError('Please enter a URL')
      return
    }

    try {
      setError(null)
      setIsLoading(true)
      await onUpload({ type, url })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process upload')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="flex items-center gap-2 bg-white hover:bg-gray-50"
        >
          <Upload className="w-4 h-4" />
          <span>Upload</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Wine Information</DialogTitle>
          <DialogDescription>
            Upload wine information by providing either an image URL or a wine page link
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="image" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image">Image URL</TabsTrigger>
            <TabsTrigger value="link">Wine Page Link</TabsTrigger>
          </TabsList>
          <TabsContent value="image" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-url">Wine Bottle Image URL</Label>
              <Input
                id="image-url"
                placeholder="https://example.com/wine-image.jpg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500">
                Enter the URL of a wine bottle image. Our AI will analyze it and extract the details.
              </p>
            </div>
            <Button 
              onClick={() => handleUpload('image')} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Processing...' : 'Process Image'}
            </Button>
          </TabsContent>
          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wine-url">Wine Page URL</Label>
              <Input
                id="wine-url"
                placeholder="https://example.com/wine-page"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500">
                Enter the URL of a wine product page. Our AI will extract the details from the page.
              </p>
            </div>
            <Button 
              onClick={() => handleUpload('link')} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Processing...' : 'Process Link'}
            </Button>
          </TabsContent>
        </Tabs>
        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
      </DialogContent>
    </Dialog>
  )
} 