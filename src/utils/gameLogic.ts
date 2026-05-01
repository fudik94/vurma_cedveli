export function generateQuestion(difficulty: number): { a: number; b: number } {
  const a = Math.floor(Math.random() * difficulty) + 1
  const b = Math.floor(Math.random() * difficulty) + 1
  return { a, b }
}

export function generateAnswers(a: number, b: number): number[] {
  const correct = a * b
  const candidates = new Set<number>()

  for (let da = -2; da <= 2; da++) {
    for (let db = -2; db <= 2; db++) {
      if (da === 0 && db === 0) continue
      const na = a + da
      const nb = b + db
      if (na > 0 && nb > 0) {
        const val = na * nb
        if (val !== correct) candidates.add(val)
      }
    }
  }

  // Fallback if not enough unique candidates (e.g. very small numbers)
  let offset = 1
  while (candidates.size < 3) {
    candidates.add(correct + offset)
    if (candidates.size < 3 && correct - offset > 0) candidates.add(correct - offset)
    offset++
  }

  const wrong = [...candidates].slice(0, 3)
  const all = [...wrong, correct]

  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }

  return all
}
