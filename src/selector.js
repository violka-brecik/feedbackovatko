const GENERIC_TAGS = new Set([
  'div', 'section', 'article', 'main', 'header', 'footer',
  'aside', 'nav', 'ul', 'ol', 'html', 'body', 'form'
])

export function getNearestContentElement(clientX, clientY) {
  const offsets = [0, -15, 15, -30, 30]
  let best = null
  let bestArea = Infinity

  for (const dx of offsets) {
    for (const dy of offsets) {
      const el = document.elementFromPoint(clientX + dx, clientY + dy)
      if (!el || GENERIC_TAGS.has(el.tagName.toLowerCase())) continue
      const rect = el.getBoundingClientRect()
      const area = rect.width * rect.height
      if (area > 0 && area < bestArea) {
        bestArea = area
        best = el
      }
    }
  }

  return best || document.elementFromPoint(clientX, clientY)
}

export function getSelector(element) {
  if (!element || element === document.body) return 'body'

  const parts = []
  let el = element

  while (el && el !== document.body && el.nodeType === 1) {
    if (el.id) {
      parts.unshift(`#${el.id}`)
      break
    }

    let selector = el.tagName.toLowerCase()
    const classes = [...el.classList]
      .filter(c => !c.startsWith('fbt-'))
      .slice(0, 2)
    if (classes.length) selector += '.' + classes.join('.')

    const siblings = el.parentNode
      ? [...el.parentNode.children].filter(s => s.tagName === el.tagName)
      : []
    if (siblings.length > 1) {
      const index = [...el.parentNode.children].indexOf(el) + 1
      selector += `:nth-child(${index})`
    }

    parts.unshift(selector)
    el = el.parentNode
  }

  return parts.join(' > ')
}

export function getElementText(element) {
  if (!element) return ''
  const text = (element.textContent || '').trim()
  if (text.length <= 80) return text
  return text.slice(0, 80) + '...'
}
