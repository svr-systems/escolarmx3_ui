import { useStore } from '@/store'

export default function Auth(to, from, next) {
  const store = useStore()
  const isAuthenticated = !!store.auth

  if (isAuthenticated) {
    return next()
  } else {
    return next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
  }
}
