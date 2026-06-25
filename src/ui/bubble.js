import { updateComment, addReply, toggleLike } from '../firebase.js'
import { promptForName } from './dialog.js'

let activeBubble = null

export function openBubble({ comment, pinEl, overlayEl, currentUser, isOrphaned }) {
  closeBubble()

  const bubble = document.createElement('div')
  bubble.className = 'fbt-bubble'
  bubble.dataset.commentId = comment.id
  bubble.innerHTML = buildBubbleHTML(comment, currentUser, isOrphaned)

  const pinRect = pinEl.getBoundingClientRect()
  const overlayRect = overlayEl.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const bubbleWidth = 280
  const rawLeft = pinRect.right - overlayRect.left + window.scrollX + 8
  const left = Math.min(rawLeft, viewportWidth - bubbleWidth - 20)
  const top = (pinRect.top - overlayRect.top + window.scrollY)
  bubble.style.left = `${left}px`
  bubble.style.top = `${top}px`

  bubble.querySelector('.fbt-reply-btn')?.addEventListener('click', () => {
    const replyCompose = bubble.querySelector('.fbt-reply-compose')
    replyCompose.style.display = replyCompose.style.display === 'none' ? '' : 'none'
  })

  bubble.querySelector('.fbt-reply-textarea')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      bubble.querySelector('.fbt-send-reply')?.click()
    }
  })

  bubble.querySelector('.fbt-send-reply')?.addEventListener('click', async () => {
    const textarea = bubble.querySelector('.fbt-reply-textarea')
    const text = textarea.value.trim()
    if (!text) return
    if (!currentUser) {
      currentUser = await promptForName()
      if (!currentUser) return
    }
    bubble.dataset.sending = 'true'
    await addReply(comment.id, { author: currentUser, text })
    textarea.value = ''
    delete bubble.dataset.sending
  })

  bubble.querySelector('.fbt-like-btn')?.addEventListener('click', () => {
    toggleLike(comment.id, currentUser)
  })

  bubble.querySelector('.fbt-resolve-btn')?.addEventListener('click', () => {
    updateComment(comment.id, { resolved: !comment.resolved })
  })

  if (comment.author === currentUser) {
    bubble.querySelector('.fbt-edit-btn')?.addEventListener('click', () => {
      const textEl = bubble.querySelector('.fbt-bubble-text')
      const current = comment.text
      textEl.innerHTML = `<textarea class="fbt-textarea fbt-edit-textarea">${current}</textarea>
        <div class="fbt-compose-actions">
          <button class="fbt-btn fbt-btn-primary fbt-save-edit" style="font-size:12px;padding:5px 10px;">Uložit</button>
          <button class="fbt-btn fbt-cancel-edit" style="font-size:12px;padding:5px 10px;">Zrušit</button>
        </div>`
      bubble.querySelector('.fbt-save-edit').addEventListener('click', async () => {
        const newText = bubble.querySelector('.fbt-edit-textarea').value.trim()
        if (!newText) return
        bubble.dataset.sending = 'true'
        await updateComment(comment.id, { text: newText })
        delete bubble.dataset.sending
      })
      bubble.querySelector('.fbt-cancel-edit').addEventListener('click', () => {
        textEl.innerHTML = comment.text
      })
    })
  }

  bubble.addEventListener('click', e => e.stopPropagation())
  overlayEl.appendChild(bubble)
  activeBubble = bubble

  setTimeout(() => {
    document.addEventListener('click', closeBubbleOnOutside)
  }, 0)
}

export function getActiveBubbleCommentId() {
  return activeBubble ? activeBubble.dataset.commentId : null
}

export function closeBubble() {
  if (activeBubble) {
    activeBubble.remove()
    activeBubble = null
    document.removeEventListener('click', closeBubbleOnOutside)
  }
}

function closeBubbleOnOutside(e) {
  if (activeBubble && !activeBubble.contains(e.target)) closeBubble()
}

function buildBubbleHTML(comment, currentUser, isOrphaned) {
  const likedByUser = comment.likes?.includes(currentUser)
  const likeLabel = `👍 ${comment.likes?.length || 0}`
  const ts = formatTime(comment.createdAt)

  const repliesHTML = (comment.replies || []).map(r => {
    const authorName = r.author || 'Anonym'
    return `
    <div class="fbt-reply">
      <div class="fbt-bubble-header" style="padding:0 0 4px;border:none;">
        <div class="fbt-avatar">${authorName[0]}</div>
        <span class="fbt-author-name">${authorName}</span>
        <span class="fbt-timestamp">${formatTime(r.createdAt)}</span>
      </div>
      <div style="color:#333;line-height:1.5;">${r.text || ''}</div>
    </div>
  `}).join('')

  return `
    ${isOrphaned ? '<div class="fbt-orphaned-badge">⚠ Prvek již neexistuje</div>' : ''}
    <div class="fbt-bubble-header">
      <div class="fbt-avatar">${comment.author[0]}</div>
      <span class="fbt-author-name">${comment.author}</span>
      ${comment.author === currentUser ? '<button class="fbt-action-btn fbt-edit-btn" style="margin-left:4px;font-size:10px;">✎</button>' : ''}
      <span class="fbt-timestamp">${ts}</span>
    </div>
    <div class="fbt-bubble-text">${comment.text}</div>
    ${repliesHTML ? `<div class="fbt-replies">${repliesHTML}</div>` : ''}
    <div class="fbt-bubble-actions">
      <button class="fbt-action-btn fbt-like-btn ${likedByUser ? 'fbt-liked' : ''}">${likeLabel}</button>
      <button class="fbt-action-btn fbt-reply-btn">Odpovědět</button>
      ${comment.resolved
        ? '<span class="fbt-resolved-badge">✓ Vyřešeno</span>'
        : '<button class="fbt-action-btn fbt-resolve-btn">Vyřešit</button>'
      }
    </div>
    <div class="fbt-reply-compose" style="display:none;">
      <div class="fbt-compose">
        <textarea class="fbt-textarea fbt-reply-textarea" rows="2" placeholder="Napiš odpověď..."></textarea>
        <div class="fbt-compose-actions">
          <button class="fbt-btn fbt-btn-primary fbt-send-reply" style="font-size:12px;padding:5px 10px;">Odeslat</button>
        </div>
      </div>
    </div>
  `
}

function formatTime(date) {
  if (!date) return ''
  const d = date instanceof Date ? date : (date.toDate ? date.toDate() : new Date(date))
  return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' }) +
    ' ' + d.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
}
