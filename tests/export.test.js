import { formatCommentsForClaude } from '../src/export.js'

const SAMPLE_COMMENTS = [
  {
    id: '1',
    author: 'Klient',
    text: 'Headline je moc vágní.',
    selector: '.hero h1',
    elementText: 'Moderní řešení pro váš byznys',
    createdAt: new Date('2026-05-20T14:22:00'),
    resolved: false,
    likes: ['Viola'],
    replies: [
      { author: 'Viola', text: 'Dobrý postřeh.', createdAt: new Date('2026-05-21T09:05:00') }
    ]
  },
  {
    id: '2',
    author: 'Viola',
    text: 'Zkontrolovat kontrast.',
    selector: null,
    elementText: null,
    x: 42.3,
    y: 78.1,
    createdAt: new Date('2026-05-21T10:00:00'),
    resolved: true,
    likes: [],
    replies: []
  }
]

test('formats comments with selector and replies', () => {
  const result = formatCommentsForClaude(SAMPLE_COMMENTS, 'svolbox.surge.sh')
  expect(result).toContain('=== FEEDBACK: svolbox.surge.sh ===')
  expect(result).toContain('[#1] NEVYŘEŠENO')
  expect(result).toContain('.hero h1 — "Moderní řešení pro váš byznys"')
  expect(result).toContain('Klient')
  expect(result).toContain('Headline je moc vágní.')
  expect(result).toContain('👍 Viola')
  expect(result).toContain('Viola: Dobrý postřeh.')
})

test('formats free pin without selector', () => {
  const result = formatCommentsForClaude(SAMPLE_COMMENTS, 'svolbox.surge.sh')
  expect(result).toContain('[#2] VYŘEŠENO')
  expect(result).toContain('[volné místo')
  expect(result).toContain('42%')
})

test('includes summary header with counts', () => {
  const result = formatCommentsForClaude(SAMPLE_COMMENTS, 'svolbox.surge.sh')
  expect(result).toContain('Komentáře: 2')
  expect(result).toContain('Nevyřešené: 1')
})
