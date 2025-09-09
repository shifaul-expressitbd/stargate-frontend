import type { MetaResponse } from "./TMetaResponse.type"


export interface FileOwner {
    _id: string
    name: string
}

export interface ImageDetails {
    public_id: string
    secure_url: string
    optimizeUrl: string
}

export interface VideoDetails {
    public_id: string
    secure_url: string
    duration?: number
    format?: string
}

export interface AlterImage {
    public_id?: string
    secure_url: string
    optimizeUrl?: string
}

export interface AlterVideo {
    public_id?: string
    secure_url: string
    duration?: number
    format?: string
}

export interface BaseFile {
    _id: string
    owner: FileOwner
    fileType: 'images' | 'videos'
    isActive: boolean
    isDeleted: boolean
    createdAt: string
    updatedAt: string
}

export interface ImageFile extends BaseFile {
    fileType: 'images'
    image: ImageDetails
    alterImage: AlterImage
    video?: never
    alterVideo: never
}

export interface VideoFile extends BaseFile {
    fileType: 'videos'
    video: VideoDetails
    image?: never
    alterImage?: never
    alterVideo: AlterVideo
}

export type File = ImageFile | VideoFile

export interface FilesResponse {
    data: File[]
    meta: MetaResponse
}

export const VALID_MIME_TYPES = {
    images: {
        accept: {
            image: ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.bmp', '.svg']
        },
        maxSize: 5 * 1024 * 1024 // 5MB
    },
    videos: {
        accept: {
            video: ['.mp4', '.webm', '.mov', '.avi', '.mkv']
        },
        maxSize: 50 * 1024 * 1024 // 50MB
    }
}

export interface OptimizedFile {
    file: string // base64 or URL string
    fileName: string // original file name
    mimeType: string // MIME type of the file
    optimizedSize: string // human-readable optimized size (e.g., "339.91 KB")
    originalSize: string // human-readable original size (e.g., "497.02 KB")
    sizeReduction: string // percentage reduction (e.g., "31.61%")
}
