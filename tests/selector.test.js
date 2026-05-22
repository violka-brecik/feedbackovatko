import { getSelector, getElementText } from '../src/selector.js'

describe('getSelector', () => {
  test('returns #id when element has id', () => {
    document.body.innerHTML = '<h1 id="main-title">Hello</h1>'
    const el = document.querySelector('#main-title')
    expect(getSelector(el)).toBe('#main-title')
  })

  test('returns tag.class for element with class', () => {
    document.body.innerHTML = '<div class="hero"><h1 class="hero-title">Hello</h1></div>'
    const el = document.querySelector('.hero-title')
    expect(getSelector(el)).toBe('div.hero > h1.hero-title')
  })

  test('uses nth-child when siblings share same tag', () => {
    document.body.innerHTML = '<ul><li>a</li><li>b</li><li>c</li></ul>'
    const el = document.querySelectorAll('li')[1]
    expect(getSelector(el)).toBe('ul > li:nth-child(2)')
  })

  test('ignores fbt- prefixed classes from host site', () => {
    document.body.innerHTML = '<div class="hero fbt-active"><p>text</p></div>'
    const el = document.querySelector('p')
    expect(getSelector(el)).toBe('div.hero > p')
  })
})

describe('getElementText', () => {
  test('returns trimmed text content up to 80 chars', () => {
    document.body.innerHTML = '<h1>  Krátký nadpis  </h1>'
    const el = document.querySelector('h1')
    expect(getElementText(el)).toBe('Krátký nadpis')
  })

  test('truncates long text with ellipsis', () => {
    document.body.innerHTML = `<p>${'a'.repeat(100)}</p>`
    const el = document.querySelector('p')
    expect(getElementText(el)).toHaveLength(83) // 80 + '...'
  })

  test('returns empty string for null element', () => {
    expect(getElementText(null)).toBe('')
  })
})
