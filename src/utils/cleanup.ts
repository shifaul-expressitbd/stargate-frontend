declare global {
  interface Window {
    gc?: () => void
    webkit?: unknown
  }

  interface Performance {
    memory?: {
      jsHeapSizeLimit: number
      totalJSHeapSize: number
      usedJSHeapSize: number
    }
  }
}

// Declare Firefox Components namespace
declare const Components:
  | {
      utils: {
        forceGC: () => void
      }
    }
  | undefined

/**
 * Attempts to trigger garbage collection in various browsers.
 * Note: Most modern browsers don't allow explicit GC triggering for security reasons.
 * This function provides best-effort attempts that may work in some environments.
 */
export const cleanupMemory = () => {
  try {
    // Chrome memory cleanup (requires --js-flags="--expose-gc" flag)
    if (typeof window !== 'undefined' && typeof window.gc === 'function') {
      window.gc()
      return
    }

    // Firefox memory cleanup
    if (typeof Components !== 'undefined' && Components?.utils?.forceGC) {
      Components.utils.forceGC()
      return
    }

    // Safari/WebKit memory cleanup (this is a hack that may help)
    if (typeof window !== 'undefined' && window.webkit) {
      try {
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
        iframe.contentWindow?.location.reload()
        setTimeout(() => {
          document.body.removeChild(iframe)
        }, 0)
      } catch (e) {
        console.warn('WebKit memory cleanup failed:', e)
      }
      return
    }
  } catch (error) {
    console.warn(
      'Memory cleanup error:',
      error instanceof Error ? error.message : String(error)
    )
  }
}
