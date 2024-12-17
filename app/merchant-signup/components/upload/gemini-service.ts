import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = 'AIzaSyBvbTaLXIJ_smj9zx5u1OGkYm-AsHdtamE'
const genAI = new GoogleGenerativeAI(API_KEY)

// Rate limiting configuration
const INITIAL_DELAY = 5000 // 5 seconds
const MAX_RETRIES = 5
const MAX_BACKOFF = 60000 // Max 60 second delay

// Initialize models
const visionModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
const textModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES,
  delayMs = INITIAL_DELAY,
  backoff = 2
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (error instanceof Error && error.message.includes('429') && retries > 0) {
      console.log(`Rate limited, retrying in ${delayMs}ms... (${retries} retries left)`)
      await delay(delayMs)
      return retryWithBackoff(operation, retries - 1, delayMs * backoff, backoff)
    }
    throw error
  }
}

interface WineData {
  name: string
  country: string
  region: string
  producer: string
  productType: string
  vintage: string
  alcoholPercentage: number
  technicalSheet?: string
  imageUrl: string
  grapeCompositions: string
  description: string
  biological: boolean
  kosher: boolean
  confidence?: Record<string, number>
  reasoning?: Record<string, string>
}

async function fetchImageAsBase64(url: string): Promise<string> {
  try {
    // Validate URL
    const validUrl = new URL(url)
    if (!validUrl.protocol.startsWith('http')) {
      throw new Error('Invalid URL protocol. Must be http:// or https://')
    }

    // Use a CORS proxy for image fetching
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
    const response = await fetch(proxyUrl, {
      headers: {
        'Accept': 'image/*'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        // Extract only the base64 data, removing the data URL prefix
        const result = reader.result as string
        const base64Data = result.split(',')[1]
        resolve(base64Data)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error fetching image:', error)
    throw new Error('Failed to fetch image. Please make sure the URL is correct and publicly accessible.')
  }
}

async function fetchPageContent(url: string): Promise<string> {
  try {
    // Validate URL
    const validUrl = new URL(url)
    if (!validUrl.protocol.startsWith('http')) {
      throw new Error('Invalid URL protocol. Must be http:// or https://')
    }

    // Use a CORS proxy for web scraping
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
    const response = await fetch(proxyUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`)
    }

    return response.text()
  } catch (error) {
    console.error('Error fetching page:', error)
    throw new Error('Failed to fetch webpage. Please make sure the URL is correct and publicly accessible.')
  }
}

function cleanAIResponse(text: string): string {
  // Remove markdown code blocks if present
  const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
  if (jsonMatch) {
    return jsonMatch[1]
  }
  return text
}

function normalizeWineData(data: any): WineData {
  return {
    name: data['Product Name'] || data.name || null,
    country: data['Country of Origin'] || data.country || null,
    region: data.Region || data.region || null,
    producer: data.Producer || data.producer || null,
    productType: data['Product Type'] || data.productType || null,
    vintage: data.Vintage || data.vintage || null,
    alcoholPercentage: data['Alcohol Percentage'] || data.alcoholPercentage || 0,
    technicalSheet: data['Technical Sheet Link'] || data.technicalSheet || '',
    imageUrl: data['Product Image URL'] || data.imageUrl || '',
    grapeCompositions: Array.isArray(data['Grape Compositions']) 
      ? data['Grape Compositions'].join(', ')
      : data.grapeCompositions || '',
    description: data['Product Description'] || data.description || '',
    biological: data.Biological || data.biological || false,
    kosher: data.Kosher || data.kosher || false,
    confidence: data._confidence || {},
    reasoning: data._reasoning || {}
  }
}

export async function processWineImage(imageUrl: string): Promise<WineData> {
  try {
    const imageData = await fetchImageAsBase64(imageUrl)

    const prompt = `You are a wine expert analyzing a wine bottle image. Extract the following information in valid JSON format and actively search for missing information using wine expertise and relationships between data points.

    For any missing information:
    1. First try to extract it directly from the image
    2. If not visible, analyze known information to infer missing details (e.g., if you see a Bordeaux red wine, you can infer likely grape varieties)
    3. Use wine domain knowledge to fill gaps when confident (70%+ certainty)
    4. For each inferred field, explain your reasoning in the _reasoning object

    Required fields:
    {
      "Product Name": "full wine name",
      "Country of Origin": "country name",
      "Region": "wine region",
      "Producer": "winery/producer name",
      "Product Type": "Red Wine/White Wine/Rosé/Sparkling/etc",
      "Vintage": "year or null",
      "Alcohol Percentage": "number or null",
      "Grape Compositions": ["grape variety 1", "grape variety 2"],
      "Product Description": "brief description of the wine",
      "Biological": boolean,
      "Kosher": boolean,
      "_confidence": {
        "field_name": "confidence percentage as number between 0-100 for any field where you added information not directly visible in the image"
      },
      "_reasoning": {
        "field_name": "explanation of how you determined this value when not directly visible"
      }
    }

    Rules:
    - Actively try to complete ALL fields using available information and wine expertise
    - Use relationships between fields (e.g., region suggests grape varieties)
    - Use null only when you cannot make a reasonable inference
    - Be specific with regions (e.g., "Bordeaux" not just "France")
    - Format numbers without % symbol
    - Return only the JSON object, no additional text
    - Ensure all field names match exactly as shown
    - Add confidence levels and reasoning for any inferred information`

    const result = await retryWithBackoff(() => 
      visionModel.generateContent([prompt, { inlineData: { data: imageData, mimeType: 'image/jpeg' } }])
    )
    
    const response = await result.response
    const text = response.text()
    
    try {
      const cleanedText = cleanAIResponse(text)
      const parsedData = JSON.parse(cleanedText)
      return normalizeWineData(parsedData)
    } catch (parseError) {
      console.error('Error parsing AI response:', text)
      throw new Error('Failed to parse AI response')
    }
  } catch (error) {
    console.error('Error processing wine image:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to process wine image')
  }
}

export async function processWinePage(url: string): Promise<WineData> {
  try {
    const pageContent = await fetchPageContent(url)

    const prompt = `You are a wine expert analyzing a wine product webpage. Extract the following information in valid JSON format and actively search for missing information using wine expertise and relationships between data points.

    For any missing information:
    1. First try to extract it directly from the webpage content
    2. If not found, analyze known information to infer missing details (e.g., if you see a Bordeaux red wine, you can infer likely grape varieties)
    3. Use wine domain knowledge to fill gaps when confident (70%+ certainty)
    4. For each inferred field, explain your reasoning in the _reasoning object

    Required fields:
    {
      "Product Name": "full wine name",
      "Country of Origin": "country name",
      "Region": "wine region",
      "Producer": "winery/producer name",
      "Product Type": "Red Wine/White Wine/Rosé/Sparkling/etc",
      "Vintage": "year or null",
      "Alcohol Percentage": "number or null",
      "Technical Sheet Link": "URL or null",
      "Product Image URL": "URL or null",
      "Grape Compositions": ["grape variety 1", "grape variety 2"],
      "Product Description": "brief description of the wine",
      "Biological": boolean,
      "Kosher": boolean,
      "_confidence": {
        "field_name": "confidence percentage as number between 0-100 for any field where you added information not directly found in the webpage"
      },
      "_reasoning": {
        "field_name": "explanation of how you determined this value when not directly found in content"
      }
    }

    Rules:
    - Actively try to complete ALL fields using available information and wine expertise
    - Use relationships between fields (e.g., region suggests grape varieties)
    - Use null only when you cannot make a reasonable inference
    - Be specific with regions (e.g., "Bordeaux" not just "France")
    - Format numbers without % symbol
    - Return only the JSON object, no additional text
    - Ensure all field names match exactly as shown
    - Add confidence levels and reasoning for any inferred information

    Webpage content:
    ${pageContent}`

    const result = await retryWithBackoff(() => 
      textModel.generateContent(prompt)
    )
    
    const response = await result.response
    const text = response.text()
    
    try {
      const cleanedText = cleanAIResponse(text)
      const parsedData = JSON.parse(cleanedText)
      return normalizeWineData(parsedData)
    } catch (parseError) {
      console.error('Error parsing AI response:', text)
      throw new Error('Failed to parse AI response')
    }
  } catch (error) {
    console.error('Error processing wine page:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to process wine page')
  }
} 