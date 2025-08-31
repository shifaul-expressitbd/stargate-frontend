export function debounce<F extends (...args: never[]) => void>(
  func: F,
  wait: number,
  immediate?: boolean
): F & { cancel: () => void } {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = function (...args: Parameters<F>): void {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  } as F & { cancel: () => void };

  debounced.cancel = (): void => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}
