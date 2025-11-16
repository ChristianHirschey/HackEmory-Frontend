const API_BASE_URL = 'http://localhost:8000'

export interface VideoResponse {
  id: string
  title: string
  description: string
  presigned_url: string
}

export interface VideosListResponse {
  start: number
  count: number
  videos: VideoResponse[]
}

export async function fetchVideos(start: number = 0): Promise<VideosListResponse> {
  const response = await fetch(`${API_BASE_URL}/videos?start=${start}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch videos: ${response.statusText}`)
  }

  return response.json()
}

// Infinite query compatible fetch function
export async function fetchVideosPage({ pageParam = 0 }: { pageParam?: number }) {
  return fetchVideos(pageParam)
}

