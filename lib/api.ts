const API_BASE_URL = 'http://localhost:8000'

export interface VideoResponse {
  id: string
  title: string
  description: string
  presigned_url: string
  created_at?: string
  subject?: string
}

export interface VideosListResponse {
  collection_offset: number
  collection_limit: number
  total_collections: number
  returned_video_count: number
  videos: VideoResponse[]
}

export interface CollectionSummary {
  id: number
  title: string
}

export interface CollectionsResponse {
  collections: CollectionSummary[]
}

export interface CollectionDetails {
  id: number
  title: string
  video_count: number
  videos: VideoResponse[]
}

export async function fetchVideos(
  collectionOffset: number = 0,
  collectionLimit: number = 1
): Promise<VideosListResponse> {
  const response = await fetch(
    `${API_BASE_URL}/videos?collection_offset=${collectionOffset}&collection_limit=${collectionLimit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch videos: ${response.statusText}`)
  }

  return response.json()
}

// Infinite query compatible fetch function
export async function fetchVideosPage({ pageParam = 0 }: { pageParam?: number }) {
  // Fetch 2 collections at a time for better UX
  return fetchVideos(pageParam, 2)
}

export async function fetchCollections(): Promise<CollectionsResponse> {
  const response = await fetch(`${API_BASE_URL}/collections`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch collections: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchCollectionDetails(collectionId: number): Promise<CollectionDetails> {
  const response = await fetch(`${API_BASE_URL}/collections/${collectionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch collection details: ${response.statusText}`)
  }

  return response.json()
}

