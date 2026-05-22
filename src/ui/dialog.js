const STORAGE_KEY = 'fbt_username'

export function getCurrentUser() {
  return localStorage.getItem(STORAGE_KEY) || null
}

export function promptForName() {
  return new Promise(resolve => {
    const overlay = document.createElement('div')
    overlay.className = 'fbt-dialog-overlay'
    overlay.innerHTML = `
      <div class="fbt-dialog">
        <h3>Jak se jmenuješ?</h3>
        <input class="fbt-input fbt-name-input" type="text" placeholder="Tvoje jméno..." maxlength="40" />
        <button class="fbt-btn fbt-btn-primary fbt-name-submit" style="width:100%;">
          Uložit a přidat komentář
        </button>
      </div>
    `

    const input = overlay.querySelector('.fbt-name-input')
    const submit = overlay.querySelector('.fbt-name-submit')

    const save = () => {
      const name = input.value.trim()
      if (!name) { input.focus(); return }
      localStorage.setItem(STORAGE_KEY, name)
      overlay.remove()
      resolve(name)
    }

    submit.addEventListener('click', save)
    input.addEventListener('keydown', e => { if (e.key === 'Enter') save() })
    document.body.appendChild(overlay)
    input.focus()
  })
}

export function showNewCommentCompose({ x, y, overlayEl, onSubmit, onCancel }) {
  const bubble = document.createElement('div')
  bubble.className = 'fbt-bubble fbt-new-comment'
  bubble.style.left = `${Math.min(x + 2, 70)}%`
  bubble.style.top = `calc(${y}% - 14px)`
  bubble.innerHTML = `
    <div class="fbt-compose">
      <textarea class="fbt-textarea" rows="3" placeholder="Napiš komentář..." autofocus></textarea>
      <div class="fbt-compose-actions">
        <button class="fbt-btn fbt-btn-primary fbt-submit-comment" style="font-size:12px;padding:5px 10px;">Odeslat ↵</button>
        <button class="fbt-btn fbt-cancel-comment" style="font-size:12px;padding:5px 10px;">Zrušit</button>
      </div>
    </div>
  `

  const textarea = bubble.querySelector('textarea')
  const submitBtn = bubble.querySelector('.fbt-submit-comment')
  const cancelBtn = bubble.querySelector('.fbt-cancel-comment')

  const submit = () => {
    const text = textarea.value.trim()
    if (!text) return
    onSubmit(text)
    bubble.remove()
  }

  submitBtn.addEventListener('click', submit)
  cancelBtn.addEventListener('click', () => { bubble.remove(); onCancel() })
  textarea.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  })

  overlayEl.appendChild(bubble)
  setTimeout(() => textarea.focus(), 0)
  return bubble
}

export function showToast(message) {
  const toast = document.createElement('div')
  toast.className = 'fbt-toast'
  toast.textContent = message
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 3000)
}
