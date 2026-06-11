import { AUTHOR_TOKEN, PIN_COLOR } from './config.js'
import { initFirebase, listenToComments, addComment, archiveAllComments } from './firebase.js'
import { getSelector, getElementText, getNearestContentElement } from './selector.js'
import { formatCommentsForClaude } from './export.js'
import { injectStyles } from './ui/styles.js'
import { createToolbar } from './ui/toolbar.js'
import { createOverlay } from './ui/overlay.js'
import { createPin } from './ui/pin.js'
import { openBubble, closeBubble, getActiveBubbleCommentId } from './ui/bubble.js'
import { getCurrentUser, promptForName, showNewCommentCompose, showToast } from './ui/dialog.js'

function init() {
  const params = new URLSearchParams(window.location.search)
  const isAuthor = params.get('author') === AUTHOR_TOKEN

  injectStyles(PIN_COLOR)
  initFirebase()

  const overlay = createOverlay(handleStickyClick)
  let stickyMode = false
  let allComments = []

  const toolbar = createToolbar({
    isAuthor,
    onToggleComments: visible => overlay.setVisible(visible),
    onToggleStickyMode: active => {
      stickyMode = active
      overlay.setStickyMode(active)
    },
    onExport: async ({ archiveAfter }) => {
      const text = formatCommentsForClaude(
        allComments.filter(c => !c.archived),
        window.location.hostname
      )
      await navigator.clipboard.writeText(text)
      showToast('✓ Zkopírováno — vlož do Claude Code (Cmd+V)')
      if (archiveAfter) await archiveAllComments(allComments.filter(c => !c.archived))
    },
    onArchive: async () => {
      await archiveAllComments(allComments.filter(c => !c.archived))
      showToast('Komentáře archivovány.')
    }
  })

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && stickyMode) {
      stickyMode = false
      overlay.setStickyMode(false)
      toolbar.deactivateStickyMode()
      closeBubble()
    }
  })

  listenToComments(comments => {
    allComments = comments
    renderPins(comments)
  })

  window.addEventListener('hashchange', () => {
    closeBubble()
    renderPins(allComments)
  })

  let resizeTimer = null
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => renderPins(allComments), 150)
  })

  let scrollRafPending = false
  document.addEventListener('scroll', () => {
    if (scrollRafPending) return
    scrollRafPending = true
    requestAnimationFrame(() => {
      repositionPins()
      scrollRafPending = false
    })
  }, { passive: true, capture: true })

  function repositionPins() {
    overlay.element.querySelectorAll('.fbt-pin').forEach(pin => {
      const comment = allComments.find(c => c.id === pin.dataset.commentId)
      if (!comment?.selector) return
      const el = document.querySelector(comment.selector)
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) return
      pin.style.left = `${rect.left + window.scrollX}px`
      pin.style.top = `${rect.top + window.scrollY}px`
    })
  }

  function renderPins(comments) {
    const openId = getActiveBubbleCommentId()
    overlay.element.querySelectorAll('.fbt-pin').forEach(p => p.remove())
    const currentHash = window.location.hash || ''
    const visible = comments.filter(c =>
      !c.archived &&
      !c.resolved &&
      (c.viewHash === undefined || c.viewHash === currentHash)
    )
    const PIN_STEP = 32

    // Spočítej pixelové pozice
    const positions = visible.map(comment => {
      const el = comment.selector ? document.querySelector(comment.selector) : null
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.width > 0 || rect.height > 0) {
          return { x: rect.left + window.scrollX, y: rect.top + window.scrollY }
        }
      }
      return {
        x: comment.x / 100 * overlay.element.offsetWidth - 14,
        y: comment.y / 100 * overlay.element.offsetHeight - 28
      }
    })

    // Rozlož překryvy posunem doprava
    positions.forEach((pos, i) => {
      let changed = true
      while (changed) {
        changed = false
        for (let j = 0; j < i; j++) {
          const other = positions[j]
          if (Math.abs(pos.x - other.x) < PIN_STEP && Math.abs(pos.y - other.y) < 28) {
            pos.x = other.x + PIN_STEP
            changed = true
          }
        }
      }
    })

    visible.forEach((comment, i) => {
      createPin({
        comment,
        index: i,
        overlayEl: overlay.element,
        x: positions[i].x,
        y: positions[i].y,
        onOpen: (c, pinEl) => {
          const isOrphaned = c.selector && !document.querySelector(c.selector)
          const currentUser = getCurrentUser()
          openBubble({ comment: c, pinEl, overlayEl: overlay.element, currentUser, isOrphaned })
        }
      })
    })

    if (openId) {
      const updated = comments.find(c => c.id === openId && !c.archived)
      if (!updated) {
        closeBubble()
      } else {
        const pinEl = overlay.element.querySelector(`.fbt-pin[data-comment-id="${openId}"]`)
        if (pinEl) {
          const activeBubbleEl = overlay.element.querySelector('.fbt-bubble')
          const hasUnsaved = activeBubbleEl &&
            !activeBubbleEl.dataset.sending &&
            [...activeBubbleEl.querySelectorAll('textarea')].some(t => t.value.trim())
          if (!hasUnsaved) {
            requestAnimationFrame(() => {
              const freshPin = overlay.element.querySelector(`.fbt-pin[data-comment-id="${openId}"]`)
              if (freshPin) {
                const isOrphaned = updated.selector && !document.querySelector(updated.selector)
                openBubble({ comment: updated, pinEl: freshPin, overlayEl: overlay.element, currentUser: getCurrentUser(), isOrphaned })
              }
            })
          }
        }
      }
    }
  }

  async function handleStickyClick({ x, y, clientX, clientY }) {
    if (getActiveBubbleCommentId()) { closeBubble(); return }

    const existingCompose = overlay.element.querySelector('.fbt-new-comment')
    if (existingCompose) {
      const ta = existingCompose.querySelector('textarea')
      ta?.focus()
      existingCompose.style.outline = `3px solid ${PIN_COLOR}`
      setTimeout(() => { existingCompose.style.outline = '' }, 500)
      return
    }

    let user = getCurrentUser()
    if (!user) {
      overlay.setStickyMode(false)
      user = await promptForName()
    }

    if (!stickyMode) return

    overlay.setStickyMode(false)
    const elementBelow = getNearestContentElement(clientX, clientY)
    overlay.setStickyMode(true)

    const selector = elementBelow ? getSelector(elementBelow) : null
    const elementText = elementBelow ? getElementText(elementBelow) : null

    showNewCommentCompose({
      x, y,
      overlayEl: overlay.element,
      onSubmit: async text => {
        await addComment({ author: user, text, selector, elementText, x, y })
      },
      onCancel: () => {}
    })
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
