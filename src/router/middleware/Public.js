import { useStore } from '@/store'

export default function Public(to, from, next) {
  const store = useStore()
  const isAuthenticated = !!store.auth

  if (isAuthenticated) {
    return next({ name: 'home' })
  } else {
    return next()
  }
}
