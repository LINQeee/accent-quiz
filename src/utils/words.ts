import {SOURCE_WORDS} from '../data/words'
import type {PreparedWord} from '../types/quiz'

const VOWELS = 'аеёиоуыэюяАЕЁИОУЫЭЮЯ'

export function isStressedVowel(ch: string): boolean {
  return (
    VOWELS.includes(ch) &&
    (ch === 'Ё' || (ch === ch.toUpperCase() && ch !== ch.toLowerCase()))
  )
}

export function prepareWord(raw: string): PreparedWord {
  const chars = Array.from(raw.trim())
  const displayChars = chars.map((ch) => ch.toLowerCase())
  const vowelPositions: number[] = []
  let stressCharIndex = -1

  chars.forEach((ch, index) => {
    if (VOWELS.includes(ch)) {
      vowelPositions.push(index)
      if (isStressedVowel(ch)) stressCharIndex = index
    }
  })

  if (stressCharIndex === -1 && vowelPositions.length === 1) {
    stressCharIndex = vowelPositions[0]
  }

  return {
    raw: chars.join(''),
    text: displayChars.join(''),
    chars: displayChars,
    vowelPositions,
    stressCharIndex
  }
}

export function getQuizWords(): PreparedWord[] {
  const seen = new Set<string>()

  return SOURCE_WORDS.map(prepareWord)
    .filter((word) => word.stressCharIndex >= 0)
    .filter((word) => {
      if (seen.has(word.text)) return false
      seen.add(word.text)
      return true
    })
    .sort(() => Math.random() - 0.5)
}
