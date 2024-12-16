export function HeroSection() {
  return (
    <div className="w-full h-[400px] relative">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <img
        src="/wine-barrels.jpg"
        alt="Wine barrels in a cellar"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center px-4">
          Merchant Signup
        </h1>
      </div>
    </div>
  )
}

