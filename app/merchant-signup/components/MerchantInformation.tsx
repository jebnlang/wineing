'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

interface MerchantInformationProps {
  onComplete: (data: any) => void;
  initialData: any;
  onContinue: () => void;
}

export function MerchantInformation({ onComplete, initialData, onContinue }: MerchantInformationProps) {
  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: initialData || {
      startDate: null,
      endDate: null,
      clientName: '',
      country: '',
      language: '',
      currency: '',
      email: '',
      phone: '',
      website: '',
      instagram: '',
      facebook: '',
      shipping: false,
      selfPickup: false,
      shippingCost: '',
      deliveryTime: '',
      pickupAddress: '',
      pickupHours: '',
      qrCodePrinting: false
    }
  })

  const shipping = watch('shipping')
  const selfPickup = watch('selfPickup')

  const onSubmit = (data: any) => {
    console.log(data)
    onComplete(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Tell us about your business</h2>
        
        {/* Campaign Duration Card */}
        <Card className="mb-8 border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Campaign Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date" className="text-gray-700">Start Date</Label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal mt-1.5`}
                          id="start-date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
              <div>
                <Label htmlFor="end-date" className="text-gray-700">End Date</Label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal mt-1.5`}
                          id="end-date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Details Card */}
        <Card className="border-gray-200 shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="client-name" className="text-gray-700">Client Name (for invoice)</Label>
              <Input 
                id="client-name" 
                {...register('clientName')}
                className="mt-1.5 border-gray-200 focus:border-gray-300 focus:ring-gray-300" 
              />
            </div>
            <div>
              <Label htmlFor="country" className="text-gray-700">Country</Label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      {/* Add more countries as needed */}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="language" className="text-gray-700">Language Preference</Label>
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      {/* Add more languages as needed */}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="currency" className="text-gray-700">Currency</Label>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                      <SelectItem value="gbp">GBP</SelectItem>
                      {/* Add more currencies as needed */}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input 
                id="email" 
                type="email"
                {...register('email')}
                className="mt-1.5 border-gray-200 focus:border-gray-300 focus:ring-gray-300" 
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-700">Phone</Label>
              <Input 
                id="phone" 
                type="tel"
                {...register('phone')}
                className="mt-1.5 border-gray-200 focus:border-gray-300 focus:ring-gray-300" 
              />
            </div>
            <div>
              <Label htmlFor="website" className="text-gray-700">Website</Label>
              <Input 
                id="website" 
                type="url"
                {...register('website')}
                className="mt-1.5 border-gray-200 focus:border-gray-300 focus:ring-gray-300" 
              />
            </div>
            <div>
              <Label htmlFor="instagram" className="text-gray-700">Instagram</Label>
              <Input 
                id="instagram" 
                {...register('instagram')}
                className="mt-1.5 border-gray-200 focus:border-gray-300 focus:ring-gray-300" 
              />
            </div>
            <div>
              <Label htmlFor="facebook" className="text-gray-700">Facebook</Label>
              <Input 
                id="facebook" 
                {...register('facebook')}
                className="mt-1.5 border-gray-200 focus:border-gray-300 focus:ring-gray-300" 
              />
            </div>
          </CardContent>
        </Card>

        {/* Delivery Options Card */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Delivery Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="shipping" className="text-gray-700">Shipping</Label>
                <Controller
                  name="shipping"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              {shipping && (
                <>
                  <div>
                    <Label htmlFor="shipping-cost" className="text-gray-700">Shipping Cost</Label>
                    <Input 
                      id="shipping-cost" 
                      type="number"
                      {...register('shippingCost', { valueAsNumber: true })}
                      className="mt-1.5 border-gray-200 focus:border-gray-300 focus:ring-gray-300" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery-time" className="text-gray-700">Delivery Time</Label>
                    <Input 
                      id="delivery-time" 
                      {...register('deliveryTime')}
                      className="mt-1.5 border-gray-200 focus:border-gray-300 focus:ring-gray-300" 
                    />
                  </div>
                </>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="self-pickup" className="text-gray-700">Self Pickup</Label>
                <Controller
                  name="selfPickup"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
              {selfPickup && (
                <>
                  <div>
                    <Label htmlFor="pickup-address" className="text-gray-700">Pickup Address</Label>
                    <Input 
                      id="pickup-address" 
                      {...register('pickupAddress')}
                      className="mt-1.5 border-gray-200 focus:border-gray-300 focus:ring-gray-300" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="pickup-hours" className="text-gray-700">Pickup Hours</Label>
                    <Input 
                      id="pickup-hours" 
                      {...register('pickupHours')}
                      className="mt-1.5 border-gray-200 focus:border-gray-300 focus:ring-gray-300" 
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="qr-code-printing" className="text-gray-700">QR Code Printing</Label>
              <Controller
                name="qrCodePrinting"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-between">
          <Button type="submit" className="bg-black text-white hover:bg-gray-800">
            Save
          </Button>
          <Button type="button" onClick={onContinue} className="bg-blue-500 text-white hover:bg-blue-600">
            Continue to Product Details
          </Button>
        </div>
      </section>
    </form>
  )
}

