export function createPin({ comment, index, overlayEl, onOpen }) {
  const pin = document.createElement('div')
  pin.className = 'fbt-pin'
  pin.dataset.commentId = comment.id

  if (comment.selector && !document.querySelector(comment.selector)) {
    pin.classList.add('fbt-orphaned')
    pin.title = 'Prvek již neexistuje'
  }

  const number = document.createElement('span')
  number.className = 'fbt-pin-number'
  number.textContent = index + 1
  pin.appendChild(number)

  pin.style.left = `calc(${comment.x}% - 14px)`
  pin.style.top = `calc(${comment.y}% - 28px)`

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
