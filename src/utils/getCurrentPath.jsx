export default function getCurrentPath(pathname) {
  if (pathname.length < 2)
    return []

  const str = String(pathname).substring(1)

  return str.split('/').map(p => p[0].toUpperCase() + p.substring(1))
}