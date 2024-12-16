interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  onStepClick: (step: number) => void
}

export function ProgressIndicator({ currentStep, totalSteps, onStepClick }: ProgressIndicatorProps) {
  return (
    <div className="mb-12">
      <div className="flex justify-between items-center max-w-2xl mx-auto">
        <button 
          onClick={() => onStepClick(1)}
          className={`text-sm font-medium ${currentStep >= 1 ? 'text-black' : 'text-gray-400'} hover:text-black transition-colors`}
        >
          Merchant Details
        </button>
        <button 
          onClick={() => onStepClick(2)}
          className={`text-sm font-medium ${currentStep >= 2 ? 'text-black' : 'text-gray-400'} hover:text-black transition-colors`}
        >
          Product Details
        </button>
      </div>
      <div className="mt-2 h-1 bg-gray-200 max-w-2xl mx-auto rounded-full">
        <div
          className="h-full bg-black rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  )
}

