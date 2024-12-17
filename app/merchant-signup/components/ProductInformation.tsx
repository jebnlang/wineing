'use client'

import { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Button } from '../../../components/ui/button'
import { Textarea } from '../../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select'
import { Switch } from '../../../components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { cn } from '../../../lib/utils'
import { ProductCard } from './ProductCard'
import { UploadModal } from './upload/UploadModal'
import { processWineImage, processWinePage } from './upload/gemini-service'

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

interface ProductInformationProps {
  merchantData: MerchantData | null;
  onBack: () => void;
  onComplete: (data: ProductData) => void;
  initialData: ProductData | null;
}

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  country: z.string().min(1, 'Country is required'),
  region: z.string().min(1, 'Region is required'),
  producer: z.string().min(1, 'Producer is required'),
  sku: z.string().min(1, 'SKU is required'),
  productType: z.string().min(1, 'Product type is required'),
  vintage: z.string().min(1, 'Vintage is required'),
  alcoholPercentage: z.number().min(0).max(100),
  technicalSheet: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
  contentAlignment: z.string(),
  grapeCompositions: z.string(),
  description: z.string().min(1, 'Description is required'),
  biological: z.boolean(),
  kosher: z.boolean(),
  shelfPrice: z.number().min(0, 'Price must be positive'),
  discountPercentage: z.number().min(0).max(100),
  wineingPrice: z.number().min(0, 'Price must be positive'),
  minBottles: z.number().min(0),
  maxBottles: z.number().min(0),
  unitType: z.string()
})

const formSchema = z.object({
  products: z.array(productSchema).min(1, 'At least one product is required')
})

type ProductFieldName = keyof Product;

export function ProductInformation({ merchantData, onBack, onComplete, initialData }: ProductInformationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const defaultProduct: Product = {
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
  }

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      products: [defaultProduct]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products'
  })

  const handleFieldsUpdate = (index: number, updates: Partial<Product>) => {
    Object.entries(updates).forEach(([key, value]) => {
      const fieldName = key as keyof Product
      if (fieldName in defaultProduct) {
        const sanitizedValue = value === null && typeof defaultProduct[fieldName] === 'string' 
          ? '' 
          : value
        setValue(`products.${index}.${fieldName}`, sanitizedValue)
      }
    })
  }

  const handleUploadData = async (index: number, data: { type: 'image' | 'link', url: string }) => {
    try {
      const wineData = data.type === 'image' 
        ? await processWineImage(data.url)
        : await processWinePage(data.url)

      handleFieldsUpdate(index, {
        name: wineData.name,
        country: wineData.country,
        region: wineData.region,
        producer: wineData.producer,
        productType: wineData.productType,
        vintage: wineData.vintage,
        alcoholPercentage: wineData.alcoholPercentage,
        technicalSheet: wineData.technicalSheet || '',
        imageUrl: data.type === 'image' ? data.url : wineData.imageUrl,
        grapeCompositions: wineData.grapeCompositions,
        description: wineData.description,
        biological: wineData.biological,
        kosher: wineData.kosher
      })
    } catch (error) {
      console.error('Error processing wine data:', error)
      throw new Error('Failed to process wine data')
    }
  }

  const onSubmit = async (data: ProductData) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      await onComplete(data)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred while saving the products')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Add Your Products (up to 5)</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          {fields.map((field, index) => (
            <Card key={field.id} className="border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex flex-row items-center justify-between mb-4">
                  <CardTitle className="text-xl text-gray-900">Product {index + 1}</CardTitle>
                  <div className="flex items-center gap-2">
                    {index > 0 && (
                      <Button type="button" variant="destructive" onClick={() => remove(index)}>
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 border-t pt-4">
                  <UploadModal onUpload={(data) => handleUploadData(index, data)} />
                  <p className="text-sm text-gray-500">Upload wine information from image or webpage</p>
                </div>
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
                          <>
                            <Input
                              {...field}
                              className={cn("mt-1", errors.products?.[index]?.name && "border-red-500")}
                            />
                            {errors.products?.[index]?.name && (
                              <p className="mt-1 text-sm text-red-500">{errors.products[index]?.name?.message}</p>
                            )}
                          </>
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`products.${index}.country`}>Country of Origin</Label>
                      <Controller
                        name={`products.${index}.country`}
                        control={control}
                        render={({ field }) => (
                          <>
                            <Input
                              {...field}
                              className={cn("mt-1", errors.products?.[index]?.country && "border-red-500")}
                            />
                            {errors.products?.[index]?.country && (
                              <p className="mt-1 text-sm text-red-500">{errors.products[index]?.country?.message}</p>
                            )}
                          </>
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
              onClick={() => append(defaultProduct)}
              variant="outline"
              className="w-full mt-4 border border-gray-200"
            >
              Add Product
            </Button>
          )}
        </div>

        <div className="space-y-8">
          {fields.map((field, index) => (
            <ProductCard
              key={field.id}
              name={watch(`products.${index}.name`) || 'Product Name'}
              vintage={watch(`products.${index}.vintage`) || 'Year'}
              region={watch(`products.${index}.region`) || 'Region'}
              countryCode={watch(`products.${index}.country`) || ''}
              composition={(watch(`products.${index}.grapeCompositions`) || '').split(',').filter(Boolean).map(g => g.trim())}
              price={watch(`products.${index}.wineingPrice`) || 0}
              originalPrice={watch(`products.${index}.shelfPrice`) || 0}
              minimumTarget={watch(`products.${index}.minBottles`) || 0}
              currentOrders={0}
              availableStock={watch(`products.${index}.maxBottles`) || 0}
              imageUrl={watch(`products.${index}.imageUrl`) || 'https://placehold.co/400x600/e2e8f0/1a2c42?text=Wine+Image'}
              description={watch(`products.${index}.description`) || ''}
              isPreview={true}
              onFieldsUpdate={(updates: Partial<Product>) => handleFieldsUpdate(index, updates)}
            />
          ))}
        </div>
      </div>

      {submitError && (
        <p className="text-sm text-red-500 mt-2">{submitError}</p>
      )}
    </form>
  )
}

