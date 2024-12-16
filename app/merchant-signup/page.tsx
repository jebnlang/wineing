'use client'

import { useState } from 'react'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { ProgressIndicator } from './components/ProgressIndicator'
import { MerchantInformation } from './components/MerchantInformation'
import { ProductInformation } from './components/ProductInformation'

export default function MerchantSignupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [merchantData, setMerchantData] = useState(null)
  const [productData, setProductData] = useState(null)

  const handleMerchantInfoComplete = (data) => {
    setMerchantData(data)
    setCurrentStep(2)
  }

  const handleProductInfoComplete = (data) => {
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

