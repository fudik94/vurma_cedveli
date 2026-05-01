import { generateQuestion, generateAnswers } from './gameLogic'

describe('generateQuestion', () => {
  it('returns numbers within difficulty range', () => {
    for (let i = 0; i < 50; i++) {
      const { a, b } = generateQuestion(7)
      expect(a).toBeGreaterThanOrEqual(1)
      expect(a).toBeLessThanOrEqual(7)
      expect(b).toBeGreaterThanOrEqual(1)
      expect(b).toBeLessThanOrEqual(7)
    }
  })

  it('works at minimum difficulty of 2', () => {
    for (let i = 0; i < 20; i++) {
      const { a, b } = generateQuestion(2)
      expect(a).toBeGreaterThanOrEqual(1)
      expect(a).toBeLessThanOrEqual(2)
      expect(b).toBeGreaterThanOrEqual(1)
      expect(b).toBeLessThanOrEqual(2)
    }
  })
})

describe('generateAnswers', () => {
  it('returns exactly 4 answers', () => {
    expect(generateAnswers(8, 13)).toHaveLength(4)
    expect(generateAnswers(1, 1)).toHaveLength(4)
    expect(generateAnswers(20, 20)).toHaveLength(4)
  })

  it('includes the correct answer', () => {
    const answers = generateAnswers(8, 13)
    expect(answers).toContain(104)
  })

  it('has no duplicate values', () => {
    for (let i = 0; i < 20; i++) {
      const answers = generateAnswers(5, 5)
      expect(new Set(answers).size).toBe(4)
    }
  })

  it('all answers are positive numbers', () => {
    const answers = generateAnswers(1, 1)
    answers.forEach((a) => expect(a).toBeGreaterThan(0))
  })

  it('wrong answers are different from correct answer', () => {
    for (let i = 0; i < 20; i++) {
      const a = Math.floor(Math.random() * 10) + 1
      const b = Math.floor(Math.random() * 10) + 1
      const answers = generateAnswers(a, b)
      const correct = a * b
      const wrongs = answers.filter((x) => x !== correct)
      expect(wrongs).toHaveLength(3)
    }
  })
})
