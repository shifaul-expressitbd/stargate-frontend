import { soundList } from '@/config/sound.config'
import { toast } from 'sonner'

// // Pre-load all sound files dynamically at once
// const SoundFiles: Record<string, HTMLAudioElement> = soundList.reduce(
//   (acc, sound) => {
//     acc[sound.id] = new Audio(`/sounds/${sound.id}.mp3`)
//     return acc
//   },
//   {} as Record<string, HTMLAudioElement>
// )

export function playSound (index?: string) {
  const id = index || localStorage.getItem('playSound')

  const soundMeta = soundList.find(s => s.id === id)
  if (!soundMeta) {
    console.warn(`No sound found for id "${id}"`)
    return
  }

  const audio = new Audio(`/sounds/${soundMeta.id}.mp3`)

  // 3) reset and play
  if (audio) {
    audio.currentTime = 0
    audio.play().catch(err => toast.error(`Failed to play "${id}":`, err))
  } else {
    console.warn(`No sound found for id "${soundList[0].name}"`)
  }
}
