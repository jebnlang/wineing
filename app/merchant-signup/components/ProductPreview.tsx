'use client'

import { useState } from 'react'
import { ProductCard } from './ProductCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Product {
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
}

interface ProductPreviewProps {
  products: Product[]
}

export function ProductPreview({ products }: ProductPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <Carousel className="w-full max-w-sm mx-auto">
          <CarouselContent>
            {products.map((product, index) => (
              <CarouselItem key={index}>
                <ProductCard 
                  {...product} 
                  price={Number(product.price)}
                  originalPrice={Number(product.originalPrice)}
                  minimumTarget={Number(product.minimumTarget)}
                  currentOrders={Number(product.currentOrders)}
                  availableStock={Number(product.availableStock)}
                  isPreview 
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {products.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      </CardContent>
    </Card>
  )
}

