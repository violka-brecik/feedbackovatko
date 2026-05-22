export function formatCommentsForClaude(comments, siteHostname) {
  const active = comments.filter(c => !c.archived)
  const unresolved = active.filter(c => !c.resolved).length
  const replyCount = active.reduce((n, c) => n + (c.replies?.length || 0), 0)
  const date = new Date().toLocaleDateString('cs-CZ')

  const lines = [
    `=== FEEDBACK: ${siteHostname} ===`,
    `Datum exportu: ${date}`,
    `Komentáře: ${active.length} | Odpovědi: ${replyCount} | Nevyřešené: ${unresolved}`,
    ''
  ]

  active.forEach((c, i) => {
    lines.push('---', '')
    lines.push(`[#${i + 1}] ${c.resolved ? 'VYŘEŠENO' : 'NEVYŘEŠENO'}`)

    if (c.selector) {
      lines.push(`Prvek: ${c.selector} — "${c.elementText}"`)
    } else {
      lines.push(`Prvek: [volné místo — ${Math.round(c.x)}% / ${Math.round(c.y)}%]`)
    }

    const ts = formatTime(c.createdAt)
    lines.push(`${c.author} (${ts}): ${c.text}`)

    if (c.likes?.length) {
      lines.push(`  👍 ${c.likes.join(', ')}`)
    }

    c.replies?.forEach(r => {
      lines.push(`${r.author}: ${r.text}`)
    })

    lines.push('')
  })

  return lines.join('\n')
}

function formatTime(date) {
  if (!date) return ''
  const d = date instanceof Date ? date : date.toDate()
  return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' }) +
    ' ' + d.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
}
