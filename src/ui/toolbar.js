export function createToolbar({ isAuthor, onToggleComments, onToggleStickyMode, onExport, onArchive }) {
  const toolbar = document.createElement('div')
  toolbar.className = 'fbt-toolbar'

  const toggleBtn = createBtn('👁 Skrýt', 'fbt-btn', () => {
    const hidden = toolbar.dataset.hidden === 'true'
    const newHidden = !hidden
    toolbar.dataset.hidden = String(newHidden)
    toggleBtn.textContent = newHidden ? '👁 Zobrazit' : '👁 Skrýt'
    onToggleComments(!newHidden)
  })

  const commentBtn = createBtn('+ Komentovat', 'fbt-btn fbt-btn-primary', () => {
    const active = commentBtn.classList.contains('fbt-active')
    if (active) {
      commentBtn.classList.remove('fbt-active')
      commentBtn.textContent = '+ Komentovat'
      onToggleStickyMode(false)
    } else {
      commentBtn.classList.add('fbt-active')
      commentBtn.textContent = '✕ Ukončit (Esc)'
      onToggleStickyMode(true)
    }
  })

  toolbar.appendChild(toggleBtn)
  toolbar.appendChild(commentBtn)

  if (isAuthor) {
    const exportBtn = createBtn('✦ Odeslat Claudovi', 'fbt-btn fbt-btn-claude', () => {
      onExport({ archiveAfter: confirm('Archivovat komentáře po odeslání?') })
    })
    const archiveBtn = createBtn('Archivovat', 'fbt-btn', () => {
      if (confirm('Archivovat všechny komentáře? Tím uzavřeš aktuální kolo feedbacku.')) {
        onArchive()
      }
    })
    toolbar.appendChild(exportBtn)
    toolbar.appendChild(archiveBtn)
  }

  toolbar.deactivateStickyMode = () => {
    commentBtn.classList.remove('fbt-active')
    commentBtn.textContent = '+ Komentovat'
  }

  document.body.appendChild(toolbar)
  return toolbar
}

function createBtn(text, className, onClick) {
  const btn = document.createElement('button')
  btn.className = className
  btn.textContent = text
  btn.addEventListener('click', onClick)
  return btn
}
