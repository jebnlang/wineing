'use client'

import { useState } from 'react'
import { Share2, Minus, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// Country name to ISO code mapping
const getCountryCode = (country: string): string => {
  const countryMap: { [key: string]: string } = {
    'united states': 'us',
    'usa': 'us',
    'france': 'fr',
    'italy': 'it',
    'spain': 'es',
    'germany': 'de',
    'portugal': 'pt',
    'argentina': 'ar',
    'chile': 'cl',
    'australia': 'au',
    'new zealand': 'nz',
    'south africa': 'za',
    'canada': 'ca',
    'austria': 'at',
    'greece': 'gr',
    'hungary': 'hu',
    'israel': 'il',
    'lebanon': 'lb',
    'morocco': 'ma',
    'romania': 'ro',
    'switzerland': 'ch',
    'united kingdom': 'gb',
    'uk': 'gb'
  }
  return countryMap[country.toLowerCase()] || 'unknown'
}

interface ProductCardProps {
  name: string
  vintage: string
  region: string
  countryCode: string
  rating?: number
  composition: string[]
  price: number
  originalPrice: number
  minimumTarget: number
  currentOrders: number
  availableStock: number
  imageUrl: string
  description?: string
  isPreview?: boolean
  onFieldsUpdate?: (fields: Partial<ProductCardProps>) => void
}

export function ProductCard({
  name,
  vintage,
  region,
  countryCode,
  rating,
  composition,
  price,
  originalPrice,
  minimumTarget,
  currentOrders,
  availableStock,
  imageUrl,
  description = '',
  isPreview = false,
  onFieldsUpdate
}: ProductCardProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100)
  const progress = (currentOrders / minimumTarget) * 100
  const isTargetReached = currentOrders >= minimumTarget
  const flagCode = getCountryCode(countryCode)

  return (
    <>
      <div className="bg-white rounded-[24px] p-6 shadow-sm border relative w-full max-w-sm">
        {/* Discount Badge */}
        <div className="absolute -top-3 -left-3 bg-[#E5B94E] text-white py-1 px-3 rounded-lg transform -rotate-12 font-medium text-lg">
          -{discountPercentage}%
        </div>

        {/* Share Button */}
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <Share2 className="w-5 h-5" />
        </button>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#722F37] text-lg">🍷</span>
            <span className="font-semibold">{rating.toFixed(1)}</span>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-xs ${i < Math.floor(rating) ? 'text-[#722F37]' : 'text-gray-300'}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Region & Country */}
        <div className="flex items-center gap-2 mb-2">
          {flagCode !== 'unknown' && (
            <img
              src={`https://flagcdn.com/24x18/${flagCode}.png`}
              alt={`${countryCode} flag`}
              className="w-6 h-4 object-cover rounded"
            />
          )}
          <span className="text-gray-700 font-medium">{region}</span>
        </div>

        {/* Wine Name */}
        <div className="mb-1">
          <h3 className="text-xl font-medium text-gray-900">{name}, {vintage}</h3>
          <button 
            className="text-indigo-600 text-sm hover:text-indigo-700"
            onClick={() => setIsDescriptionOpen(true)}
          >
            Read more
          </button>
        </div>

        {/* Wine Image */}
        <div className="relative w-full h-48 my-4">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Composition */}
        {Array.isArray(composition) && composition.map((comp, index) => (
          <p key={index} className="text-sm text-gray-600 mb-4">{comp}</p>
        ))}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-2xl font-bold">${Number(price).toFixed(2)}</span>
          <span className="text-gray-400 line-through">${Number(originalPrice).toFixed(2)}</span>
        </div>

        {/* Progress Section */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Minimum target {currentOrders}/{minimumTarget}
            </span>
            {isTargetReached && (
              <span className="text-emerald-600 font-medium">Target Reached!</span>
            )}
          </div>
          <div className="flex gap-1 mb-2">
            {Array.from({ length: minimumTarget }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 ${i < currentOrders ? 'text-[#E54E4E]' : 'text-gray-200'}`}
              >
                🍾
              </div>
            ))}
          </div>
          <div className="h-2 bg-red-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Ordered {currentOrders}</span>
            <span>Available {availableStock}</span>
          </div>
        </div>

        {/* Join Section */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border hover:bg-gray-50">
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            value="1"
            className="w-12 text-center border-none"
            readOnly
          />
          <button className="p-2 rounded-lg border hover:bg-gray-50">
            <Plus className="w-4 h-4" />
          </button>
          <Button 
            className="flex-1 bg-[#1F2937] hover:bg-[#374151] text-white rounded-full"
            disabled={isPreview}
          >
            Join ${price.toFixed(2)}
          </Button>
        </div>
      </div>

      <Dialog open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{name}, {vintage}</DialogTitle>
          </DialogHeader>
          <div className="mt-4 text-gray-700">
            {description || 'No description available.'}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

