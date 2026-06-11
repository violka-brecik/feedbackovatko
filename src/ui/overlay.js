export function createOverlay(onClickInStickyMode) {
  const overlay = document.createElement('div')
  overlay.className = 'fbt-overlay'
  overlay.style.height = `${document.documentElement.scrollHeight}px`
  document.body.style.position = 'relative'
  document.body.appendChild(overlay)

  const cursorPin = document.createElement('div')
  cursorPin.className = 'fbt-cursor-pin'
  document.body.appendChild(cursorPin)

  const resizeObserver = new ResizeObserver(() => {
    overlay.style.height = `${document.documentElement.scrollHeight}px`
  })
  resizeObserver.observe(document.body)

  document.addEventListener('mousemove', e => {
    if (!overlay.classList.contains('fbt-sticky')) return
    if (e.target.closest?.('.fbt-bubble, .fbt-new-comment')) {
      cursorPin.style.display = 'none'
      return
    }
    cursorPin.style.display = 'block'
    cursorPin.style.left = `${e.clientX - 14}px`
    cursorPin.style.top = `${e.clientY - 28}px`
  })

  document.addEventListener('mouseleave', () => {
    cursorPin.style.display = 'none'
  })

  overlay.addEventListener('click', e => {
    if (!overlay.classList.contains('fbt-sticky')) return
    e.preventDefault()
    e.stopPropagation()
    const rect = overlay.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / overlay.offsetWidth) * 100
    const y = ((e.clientY - rect.top) / overlay.offsetHeight) * 100
    onClickInStickyMode({ x, y, clientX: e.clientX, clientY: e.clientY })
  })

  return {
    element: overlay,
    setStickyMode(active) {
      overlay.classList.toggle('fbt-sticky', active)
      if (!active) cursorPin.style.display = 'none'
    },
    setVisible(visible) {
      overlay.style.display = visible ? '' : 'none'
    }
  }
}
