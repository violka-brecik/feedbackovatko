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
