import { useContext } from 'react'
import { NavigationContext } from './navigation.js'

export default function Link({ href, children, onClick, ...props }) {
  const { navigate } = useContext(NavigationContext)
  function follow(event) {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      !navigate ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target ||
      props.download
    )
      return
    if (!href.startsWith('/') && !href.startsWith('#')) return
    event.preventDefault()
    navigate(href)
  }
  return (
    <a href={href} onClick={follow} {...props}>
      {children}
    </a>
  )
}
