import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, Timestamp } from 'firebase/firestore'
import type { GameResult } from '../types'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export async function saveResult(result: Omit<GameResult, 'id' | 'createdAt'>): Promise<void> {
  await addDoc(collection(db, 'results'), {
    ...result,
    createdAt: Timestamp.now(),
  })
}

export async function getResults(): Promise<GameResult[]> {
  const snapshot = await getDocs(collection(db, 'results'))
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name as string,
    score: doc.data().score as number,
    correctAnswers: doc.data().correctAnswers as number,
    difficulty: doc.data().difficulty as number,
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
  }))
}
