import { Check } from 'lucide-react'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  onStepClick: (step: number) => void
}

export function ProgressIndicator({ currentStep, totalSteps, onStepClick }: ProgressIndicatorProps) {
  return (
    <div className="h-[70px] border-b border-gray-100 bg-white">
      <div className="max-w-2xl mx-auto relative">
        {/* Connecting Lines */}
        <div className="absolute top-[10px] left-[1.5rem] right-[1.5rem] h-[2px] bg-[#E5E7EB]" />
        <div 
          className="absolute top-[10px] left-[1.5rem] h-[2px] bg-black transition-all duration-500 ease-out"
          style={{ width: `calc(${((currentStep - 1) / (totalSteps - 1)) * 100}% - ${currentStep === 1 ? '1.5rem' : '0rem'})` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between px-6">
          <div className="flex flex-col items-center">
            <button 
              onClick={() => onStepClick(1)}
              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 text-xs
                ${currentStep > 1 
                  ? 'border-black bg-black text-white' 
                  : currentStep === 1
                    ? 'border-black bg-black text-white'
                    : 'border-[#E5E7EB] bg-white text-gray-400'
                }`}
            >
              {currentStep > 1 ? (
                <Check className="w-3 h-3" />
              ) : (
                "1"
              )}
            </button>
            <span className={`text-[14px] font-medium mt-1 transition-all duration-300 ${currentStep >= 1 ? 'text-black' : 'text-gray-400'}`}>
              Merchant Details
            </span>
          </div>

          <div className="flex flex-col items-center">
            <button 
              onClick={() => onStepClick(2)}
              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 text-xs
                ${currentStep > 2 
                  ? 'border-black bg-black text-white' 
                  : currentStep === 2
                    ? 'border-black bg-black text-white'
                    : 'border-[#E5E7EB] bg-white text-gray-400'
                }`}
            >
              {currentStep > 2 ? (
                <Check className="w-3 h-3" />
              ) : (
                "2"
              )}
            </button>
            <span className={`text-[14px] font-medium mt-1 transition-all duration-300 ${currentStep >= 2 ? 'text-black' : 'text-gray-400'}`}>
              Product Details
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

