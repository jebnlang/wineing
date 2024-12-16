'use client'

import { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProductPreview } from './ProductPreview'

interface ProductInformationProps {
  merchantData: any;
  onBack: () => void;
  onComplete: (data: any) => void;
  initialData: any;
}

export function ProductInformation({ merchantData, onBack, onComplete, initialData }: ProductInformationProps) {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: initialData || {
      products: [{
        name: '',
        country: '',
        region: '',
        producer: '',
        sku: '',
        productType: '',
        vintage: '',
        alcoholPercentage: 0,
        technicalSheet: '',
        imageUrl: '',
        contentAlignment: '',
        grapeCompositions: '',
        description: '',
        biological: false,
        kosher: false,
        shelfPrice: 0,
        discountPercentage: 0,
        wineingPrice: 0,
        minBottles: 0,
        maxBottles: 0,
        unitType: 'bottle',
      }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products'
  })

  const onSubmit = (data: any) => {
    console.log(data)
    onComplete(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Add Your Products (up to 5)</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          {fields.map((field, index) => (
            <Card key={field.id} className="border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-gray-900">Product {index + 1}</CardTitle>
                {index > 0 && (
                  <Button type="button" variant="destructive" onClick={() => remove(index)}>
                    Remove
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic-info">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic-info" className="space-y-4">
                    <div>
                      <Label htmlFor={`products.${index}.name`}>Product Name</Label>
                      <Controller
                        name={`products.${index}.name`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className="mt-1"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`products.${index}.country`}>Country of Origin</Label>
                      <Controller
                        name={`products.${index}.country`}
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="france">France</SelectItem>
                              <SelectItem value="italy">Italy</SelectItem>
                              <SelectItem value="spain">Spain</SelectItem>
                              {/* Add more countries as needed */}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`products.${index}.region`}>Region</Label>
                      <Controller
                        name={`products.${index}.region`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className="mt-1"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`products.${index}.producer`}>Producer</Label>
                      <Controller
                        name={`products.${index}.producer`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className="mt-1"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`products.${index}.sku`}>SKU</Label>
                      <Controller
                        name={`products.${index}.sku`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className="mt-1"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`products.${index}.productType`}>Product Type</Label>
                      <Controller
                        name={`products.${index}.productType`}
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select product type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="red">Red Wine</SelectItem>
                              <SelectItem value="white">White Wine</SelectItem>
                              <SelectItem value="rose">Rosé Wine</SelectItem>
                              <SelectItem value="sparkling">Sparkling Wine</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`products.${index}.vintage`}>Vintage</Label>
                      <Controller
                        name={`products.${index}.vintage`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className="mt-1"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`products.${index}.alcoholPercentage`}>Alcohol Percentage</Label>
                      <Controller
                        name={`products.${index}.alcoholPercentage`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            step="0.1"
                            className="mt-1"
                          />
                        )}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="details" className="space-y-4">
                    <div>
                      <Label htmlFor={`products.${index}.technicalSheet`}>Technical Sheet Link</Label>
                      <Controller
                        name={`products.${index}.technicalSheet`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="url"
                            className="mt-1"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`products.${index}.imageUrl`}>Product Image URL</Label>
                      <Controller
                        name={`products.${index}.imageUrl`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="url"
                            className="mt-1"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`products.${index}.contentAlignment`}>Content Alignment</Label>
                      <Controller
                        name={`products.${index}.contentAlignment`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className="mt-1"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`products.${index}.grapeCompositions`}>Grape Compositions</Label>
                      <Controller
                        name={`products.${index}.grapeCompositions`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            className="mt-1"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`products.${index}.description`}>Product Description</Label>
                      <Controller
                        name={`products.${index}.description`}
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            className="mt-1"
                          />
                        )}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name={`products.${index}.biological`}
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor={`products.${index}.biological`}>Biological</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Controller
                        name={`products.${index}.kosher`}
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <Label htmlFor={`products.${index}.kosher`}>Kosher</Label>
                    </div>
                  </TabsContent>
                  <TabsContent value="pricing" className="space-y-4">
                    <div>
                      <Label htmlFor={`products.${index}.shelfPrice`}>Shelf Price</Label>
                      <Controller
                        name={`products.${index}.shelfPrice`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            className="mt-1"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`products.${index}.discountPercentage`}>Discount Percentage</Label>
                      <Controller
                        name={`products.${index}.discountPercentage`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            step="0.1"
                            className="mt-1"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`products.${index}.wineingPrice`}>WINEing Price</Label>
                      <Controller
                        name={`products.${index}.wineingPrice`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            className="mt-1"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`products.${index}.minBottles`}>Minimum Bottles</Label>
                      <Controller
                        name={`products.${index}.minBottles`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            className="mt-1"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`products.${index}.maxBottles`}>Maximum Bottles</Label>
                      <Controller
                        name={`products.${index}.maxBottles`}
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="number"
                            className="mt-1"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`products.${index}.unitType`}>Unit Type</Label>
                      <Controller
                        name={`products.${index}.unitType`}
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select unit type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="case">Case</SelectItem>
                              <SelectItem value="bottle">Bottle</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}

          {fields.length < 5 && (
            <Button
              type="button"
              onClick={() => append({})}
              className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Add Another Product
            </Button>
          )}

          <div className="mt-8 flex justify-between">
            <Button type="button" onClick={onBack} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
              Back to Merchant Information
            </Button>
            <Button type="submit" className="bg-black text-white hover:bg-gray-800">
              Save and Continue
            </Button>
          </div>
        </div>

        <div className="sticky top-24">
          <ProductPreview
            products={fields.map((field, index) => ({
              name: watch(`products.${index}.name`) || 'Product Name',
              vintage: watch(`products.${index}.vintage`) || '2021',
              region: watch(`products.${index}.region`) || 'Region',
              countryCode: watch(`products.${index}.country`) || 'us',
              rating: 4.0,
              composition: [watch(`products.${index}.grapeCompositions`) || 'Grape composition'],
              price: Number(watch(`products.${index}.wineingPrice`) || 0),
              originalPrice: Number(watch(`products.${index}.shelfPrice`) || 0),
              minimumTarget: Number(watch(`products.${index}.minBottles`) || 6),
              currentOrders: 0,
              availableStock: Number(watch(`products.${index}.maxBottles`) || 20),
              imageUrl: watch(`products.${index}.imageUrl`) || '/placeholder.svg'
            }))}
          />
        </div>
      </div>
    </form>
  )
}
