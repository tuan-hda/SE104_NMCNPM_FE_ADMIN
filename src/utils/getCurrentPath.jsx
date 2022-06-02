export default function getCurrentPath(pathname) {
  const str = String(pathname).substring(1)

  return str.split('/').map(p => p[0].toUpperCase() + p.substring(1))
}