'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Instagram, Linkedin, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="bg-white py-4 px-6 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1300px] mx-auto flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <div className="relative w-[180px] h-[60px]">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WINEing%C2%A0vertical%20Logo%20%203%20copy-YvJDdMRa19RfjyQW6KRMojsDkRUqaS.png"
              alt="WINEing - Buy Better Together"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/offering" className="text-gray-800 hover:text-gray-600">
            Our Offering
          </Link>
          <Link href="/about" className="text-gray-800 hover:text-gray-600">
            About us
          </Link>
          <Link href="/media" className="text-gray-800 hover:text-gray-600">
            Media & Projects
          </Link>
          <Button variant="default" className="bg-black text-white hover:bg-gray-800">
            Contact us
          </Button>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="https://linkedin.com" className="text-gray-800 hover:text-gray-600">
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link href="https://instagram.com" className="text-gray-800 hover:text-gray-600">
            <Instagram className="h-5 w-5" />
          </Link>
          <button className="md:hidden text-gray-800">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  )
}

