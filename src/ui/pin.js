export function createPin({ comment, index, overlayEl, onOpen, x, y }) {
  const pin = document.createElement('div')
  pin.className = 'fbt-pin'
  pin.dataset.commentId = comment.id

  if (comment.resolved) {
    pin.classList.add('fbt-resolved')
    pin.title = 'Vyřešeno'
  } else if (comment.selector && !document.querySelector(comment.selector)) {
    pin.classList.add('fbt-orphaned')
    pin.title = 'Prvek již neexistuje'
  }

  const number = document.createElement('span')
  number.className = 'fbt-pin-number'
  number.textContent = index + 1
  pin.appendChild(number)

  pin.style.left = `${x}px`
  pin.style.top = `${y}px`

  pin.addEventListener('click', e => {
    e.stopPropagation()
    onOpen(comment, pin)
  })

  overlayEl.appendChild(pin)
  return pin
}

export function removePin(commentId, overlayEl) {
  const pin = overlayEl.querySelector(`[data-comment-id="${commentId}"]`)
  if (pin) pin.remove()
}
