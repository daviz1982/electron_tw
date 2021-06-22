import { useState, useCallback } from 'react'

export const useLocalStorage = (key, initialValue) => {
  if (!key) {
    throw new Error('useLocalStorage key is a required parameter')
  }

  const [value, setValue] = useState(() => {
    try {
      const localStorageValue = localStorage.getItem(key)

      if (localStorageValue !== null) {
        return JSON.parse(localStorageValue)
      } else {
        if (initialValue) {
          localStorage.setItem(key, JSON.stringify(initialValue))
        }
        return initialValue
      }
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw. Also JSON.stringify can throw.
      return initialValue
    }
  })

  const set = useCallback(
    (value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value))
        setValue(value)
      } catch {
        // If user is in private mode or has storage restriction
        // localStorage can throw. Also JSON.stringify can throw.
      }
    },
    [key, setValue]
  )

  const remove = useCallback(() => {
    try {
      localStorage.removeItem(key)
      setValue(undefined)
    } catch {
      // If user is in private mode or has storage restriction
      // localStorage can throw. Also JSON.stringify can throw.
    }
  }, [key, setValue])

  return { value, set, remove }
}
