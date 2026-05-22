import { AUTHOR_TOKEN, PIN_COLOR } from './config.js'
import { initFirebase, listenToComments, addComment, archiveAllComments } from './firebase.js'
import { getSelector, getElementText } from './selector.js'
import { formatCommentsForClaude } from './export.js'
import { injectStyles } from './ui/styles.js'
import { createToolbar } from './ui/toolbar.js'
import { createOverlay } from './ui/overlay.js'
import { createPin } from './ui/pin.js'
import { openBubble, closeBubble } from './ui/bubble.js'
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

  function renderPins(comments) {
    overlay.element.querySelectorAll('.fbt-pin').forEach(p => p.remove())
    comments.filter(c => !c.archived).forEach((comment, i) => {
      createPin({
        comment,
        index: i,
        overlayEl: overlay.element,
        onOpen: (c, pinEl) => {
          const isOrphaned = c.selector && !document.querySelector(c.selector)
          const currentUser = getCurrentUser()
          openBubble({ comment: c, pinEl, overlayEl: overlay.element, currentUser, isOrphaned })
        }
      })
    })
  }

  async function handleStickyClick({ x, y, clientX, clientY }) {
    let user = getCurrentUser()
    if (!user) user = await promptForName()

    overlay.setStickyMode(false)
    const elementBelow = document.elementFromPoint(clientX, clientY)
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
