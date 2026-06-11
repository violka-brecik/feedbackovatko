import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, addDoc, updateDoc,
  doc, getDoc, onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { FIREBASE_CONFIG } from './config.js'

let db = null

export function initFirebase() {
  const app = initializeApp(FIREBASE_CONFIG)
  db = getFirestore(app)
}

function getSiteKey() {
  const hostname = window.location.hostname.replace(/\./g, '-')
  const path = window.location.pathname
    .replace(/\.html$/, '')
    .replace(/\/$/, '')
    .replace(/\//g, '-') || '-index'
  return `${hostname}${path}`
}

function commentsRef() {
  return collection(db, 'sites', getSiteKey(), 'comments')
}

export function listenToComments(onChange) {
  const q = query(commentsRef(), orderBy('createdAt', 'asc'))
  return onSnapshot(q, snapshot => {
    const comments = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
    onChange(comments)
  })
}

export async function addComment(data) {
  return addDoc(commentsRef(), {
    ...data,
    viewHash: window.location.hash || '',
    createdAt: serverTimestamp(),
    resolved: false,
    archived: false,
    likes: [],
    replies: []
  })
}

export async function updateComment(id, data) {
  return updateDoc(doc(db, 'sites', getSiteKey(), 'comments', id), data)
}

export async function addReply(commentId, reply) {
  const commentDoc = doc(db, 'sites', getSiteKey(), 'comments', commentId)
  const snap = await getDoc(commentDoc)
  const current = snap.data().replies || []
  return updateDoc(commentDoc, {
    replies: [...current, { ...reply, createdAt: new Date() }]
  })
}

export async function toggleLike(commentId, userName) {
  const commentDoc = doc(db, 'sites', getSiteKey(), 'comments', commentId)
  const snap = await getDoc(commentDoc)
  const likes = snap.data().likes || []
  const newLikes = likes.includes(userName)
    ? likes.filter(n => n !== userName)
    : [...likes, userName]
  return updateDoc(commentDoc, { likes: newLikes })
}

export async function archiveAllComments(comments) {
  const updates = comments.map(c =>
    updateDoc(doc(db, 'sites', getSiteKey(), 'comments', c.id), { archived: true })
  )
  return Promise.all(updates)
}
