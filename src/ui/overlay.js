export function createOverlay(onClickInStickyMode) {
  const overlay = document.createElement('div')
  overlay.className = 'fbt-overlay'
  overlay.style.height = `${document.documentElement.scrollHeight}px`
  document.body.style.position = 'relative'
  document.body.appendChild(overlay)

  const resizeObserver = new ResizeObserver(() => {
    overlay.style.height = `${document.documentElement.scrollHeight}px`
  })
  resizeObserver.observe(document.body)

  overlay.addEventListener('click', e => {
    if (!overlay.classList.contains('fbt-sticky')) return
    e.preventDefault()
    e.stopPropagation()
    const rect = overlay.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / overlay.offsetWidth) * 100
    const y = ((e.clientY - rect.top + window.scrollY) / overlay.offsetHeight) * 100
    onClickInStickyMode({ x, y, clientX: e.clientX, clientY: e.clientY })
  })

  return {
    element: overlay,
    setStickyMode(active) {
      overlay.classList.toggle('fbt-sticky', active)
    },
    setVisible(visible) {
      overlay.style.display = visible ? '' : 'none'
    }
  }
}
