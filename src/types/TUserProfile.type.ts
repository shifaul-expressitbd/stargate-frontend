export interface UserProfile {
  _id: string
  name: string
  email: string
  phone?: string
  address?: string
  picture?: {
    optimizeUrl: string
    public_id: string
    secure_url: string
  }
  alterImage?: {
    optimizeUrl: string
    public_id: string
    secure_url: string
  }
  role: string
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
}
