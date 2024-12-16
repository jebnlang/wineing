interface MerchantData {
  startDate: Date | null;
  endDate: Date | null;
  clientName: string;
  country: string;
  language: string;
  currency: string;
  email: string;
  phone: string;
  website: string;
  instagram: string;
  facebook: string;
  shipping: boolean;
  selfPickup: boolean;
  shippingCost: string;
  deliveryTime: string;
  pickupAddress: string;
  pickupHours: string;
  qrCodePrinting: boolean;
}

interface Product {
  name: string;
  country: string;
  region: string;
  producer: string;
  sku: string;
  productType: string;
  vintage: string;
  alcoholPercentage: number;
  technicalSheet: string;
  imageUrl: string;
  contentAlignment: string;
  grapeCompositions: string;
  description: string;
  biological: boolean;
  kosher: boolean;
  shelfPrice: number;
  discountPercentage: number;
  wineingPrice: number;
  minBottles: number;
  maxBottles: number;
  unitType: string;
}

interface ProductData {
  products: Product[];
}

'use client'

import { useState } from 'react'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { ProgressIndicator } from './components/ProgressIndicator'
import { MerchantInformation } from './components/MerchantInformation'
import { ProductInformation } from './components/ProductInformation'

export default function MerchantSignupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [merchantData, setMerchantData] = useState<MerchantData | null>(null)
  const [productData, setProductData] = useState<ProductData | null>(null)

  const handleMerchantInfoComplete = (data: MerchantData) => {
    setMerchantData(data)
    setCurrentStep(2)
  }

  const handleProductInfoComplete = (data: ProductData) => {
    setProductData(data)
    // Here you would typically submit both merchantData and productData
    console.log('Merchant Data:', merchantData)
    console.log('Product Data:', data)
  }

  const handleBackToMerchantInfo = () => {
    setCurrentStep(1)
  }

  const handleContinueToProductInfo = () => {
    setCurrentStep(2)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <main className="container mx-auto px-4 py-12">
        <ProgressIndicator 
          currentStep={currentStep} 
          totalSteps={2} 
          onStepClick={setCurrentStep} 
        />
        {currentStep === 1 ? (
          <MerchantInformation 
            onComplete={handleMerchantInfoComplete} 
            initialData={merchantData}
            onContinue={handleContinueToProductInfo}
          />
        ) : (
          <ProductInformation 
            merchantData={merchantData} 
            onBack={handleBackToMerchantInfo}
            onComplete={handleProductInfoComplete}
            initialData={productData}
          />
        )}
      </main>
    </div>
  )
}

