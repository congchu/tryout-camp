import { doc, getDoc, setDoc, updateDoc, Firestore } from 'firebase/firestore'
import { getFirebaseDb } from './firebase'

// Lazy get db instance
let _db: Firestore | null = null
function db(): Firestore {
  if (!_db) {
    _db = getFirebaseDb()
  }
  return _db
}

// ============================================
// Content Types (for Admin)
// ============================================

export interface StepContent {
  id: string
  title: string
  duration?: string
  content: string
  checkItems?: string[]
}

export interface MissionField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'file' | 'url_or_file'
  placeholder?: string
  options?: string[]
  required?: boolean
  accept?: string
}

export interface DayContent {
  title: string
  subtitle: string
  steps: StepContent[]
  mission: {
    title: string
    description: string
    placeholder?: string
    fields?: MissionField[]
  }
}

// ============================================
// Content Management (Admin)
// ============================================

const CONTENT_DOC_ID = 'ai-portfolio-workbook'

// Get all day contents from Firestore
export async function getWorkbookContent(): Promise<Record<number, DayContent> | null> {
  const docRef = doc(db(), 'workbook_content', CONTENT_DOC_ID)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data() as Record<number, DayContent>
  }
  return null
}

// Get single day content
export async function getDayContent(day: number): Promise<DayContent | null> {
  const content = await getWorkbookContent()
  if (content && content[day]) {
    return content[day]
  }
  return null
}

// Save single day content
export async function saveDayContent(day: number, content: DayContent): Promise<void> {
  const docRef = doc(db(), 'workbook_content', CONTENT_DOC_ID)
  const existing = await getWorkbookContent()

  await setDoc(docRef, {
    ...existing,
    [day]: content,
    updatedAt: new Date(),
  }, { merge: true })
}

// ============================================
// Progress Types
// ============================================

export interface DayProgress {
  status: 'not_started' | 'in_progress' | 'completed'
  submission?: string
  submittedAt?: Date
  updatedAt?: Date
  draft?: Record<string, string>  // 임시 저장 데이터
}

export interface WorkbookProgress {
  day1?: DayProgress
  day2?: DayProgress
  day3?: DayProgress
  day4?: DayProgress
  day5?: DayProgress
  createdAt?: Date
  updatedAt?: Date
}

// ============================================
// User Profile
// ============================================

export interface UserProfile {
  name: string
  email: string
  createdAt?: Date
  updatedAt?: Date
}

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const docRef = doc(db(), 'user_profiles', userId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile
  }
  return null
}

// Save user profile
export async function saveUserProfile(userId: string, profile: { name: string; email: string }): Promise<void> {
  const docRef = doc(db(), 'user_profiles', userId)
  await setDoc(docRef, {
    ...profile,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

// Get user's workbook progress
export async function getWorkbookProgress(userId: string): Promise<WorkbookProgress | null> {
  const docRef = doc(db(), 'workbook_progress', userId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return docSnap.data() as WorkbookProgress
  }
  return null
}

// Initialize workbook progress for new user
export async function initWorkbookProgress(userId: string): Promise<void> {
  const docRef = doc(db(), 'workbook_progress', userId)
  await setDoc(docRef, {
    day1: { status: 'not_started' },
    day2: { status: 'not_started' },
    day3: { status: 'not_started' },
    day4: { status: 'not_started' },
    day5: { status: 'not_started' },
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

// Update specific day progress
export async function updateDayProgress(
  userId: string,
  day: 'day1' | 'day2' | 'day3' | 'day4' | 'day5',
  progress: Partial<DayProgress>
): Promise<void> {
  const docRef = doc(db(), 'workbook_progress', userId)
  await updateDoc(docRef, {
    [day]: {
      ...progress,
      updatedAt: new Date(),
    },
    updatedAt: new Date(),
  })
}

// Save mission draft
export async function saveMissionDraft(
  userId: string,
  day: 'day1' | 'day2' | 'day3' | 'day4' | 'day5',
  draft: Record<string, string>
): Promise<void> {
  const docRef = doc(db(), 'workbook_progress', userId)
  await updateDoc(docRef, {
    [day]: {
      status: 'in_progress',
      draft,
      updatedAt: new Date(),
    },
    updatedAt: new Date(),
  })
}

// Submit day mission (legacy - simple text)
export async function submitDayMission(
  userId: string,
  day: 'day1' | 'day2' | 'day3' | 'day4' | 'day5',
  submission: string
): Promise<void> {
  const docRef = doc(db(), 'workbook_progress', userId)
  await updateDoc(docRef, {
    [day]: {
      status: 'completed',
      submission,
      submittedAt: new Date(),
      updatedAt: new Date(),
    },
    updatedAt: new Date(),
  })
}

// ============================================
// Mission Submission Types (Structured)
// ============================================

export interface MissionSubmission {
  id?: string
  userId: string
  userEmail: string
  userName: string
  day: number
  prompt: string        // ChatGPT로 완성한 프롬프트
  tool: string          // 사용한 도구 (여러 개 가능)
  reference?: string    // 참고한 사이트 (URL 또는 스크린샷)
  result?: string       // 결과물 (URL 또는 스크린샷)
  rating?: string       // 결과물 첫인상 (1~10점)
  likes?: string        // 마음에 드는 부분
  dislikes?: string     // 아쉬운 부분
  feedback: string      // 소감
  submittedAt: Date
}

// Submit structured mission
export async function submitMission(
  userId: string,
  userEmail: string,
  userName: string,
  day: number,
  data: {
    prompt: string
    tool: string
    reference?: string
    result?: string
    rating?: string
    likes?: string
    dislikes?: string
    feedback: string
  }
): Promise<string> {
  const { addDoc, collection, query, where, getDocs, updateDoc: updateDocument, limit } = await import('firebase/firestore')

  // Filter out undefined/empty values to avoid Firestore errors
  const submission: Record<string, unknown> = {
    userId,
    userEmail,
    userName,
    day,
    prompt: data.prompt,
    tool: data.tool,
    feedback: data.feedback,
  }

  // Only add optional fields if they have values
  if (data.reference) submission.reference = data.reference
  if (data.result) submission.result = data.result
  if (data.rating) submission.rating = data.rating
  if (data.likes) submission.likes = data.likes
  if (data.dislikes) submission.dislikes = data.dislikes

  // Check if submission already exists for this user/day
  const existingQuery = query(
    collection(db(), 'mission_submissions'),
    where('userId', '==', userId),
    where('day', '==', day),
    limit(1)
  )
  const existingSnapshot = await getDocs(existingQuery)

  let docId: string

  if (!existingSnapshot.empty) {
    // Update existing submission
    const existingDoc = existingSnapshot.docs[0]
    docId = existingDoc.id
    await updateDocument(doc(db(), 'mission_submissions', docId), {
      ...submission,
      updatedAt: new Date(),
    })
  } else {
    // Create new submission
    submission.submittedAt = new Date()
    const docRef = await addDoc(collection(db(), 'mission_submissions'), submission)
    docId = docRef.id
  }

  // Also update user's progress
  const progressDocRef = doc(db(), 'workbook_progress', userId)
  await updateDoc(progressDocRef, {
    [`day${day}`]: {
      status: 'completed',
      submissionId: docId,
      submittedAt: new Date(),
      updatedAt: new Date(),
    },
    updatedAt: new Date(),
  })

  return docId
}

// Get all submissions for a specific day (for community view)
export async function getDaySubmissions(day: number): Promise<MissionSubmission[]> {
  const { collection, query, where, orderBy, getDocs } = await import('firebase/firestore')

  const q = query(
    collection(db(), 'mission_submissions'),
    where('day', '==', day),
    orderBy('submittedAt', 'desc')
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as MissionSubmission[]
}

// Get user's submission for a specific day
export async function getUserSubmission(userId: string, day: number): Promise<MissionSubmission | null> {
  const { collection, query, where, getDocs, limit } = await import('firebase/firestore')

  const q = query(
    collection(db(), 'mission_submissions'),
    where('userId', '==', userId),
    where('day', '==', day),
    limit(1)
  )

  const snapshot = await getDocs(q)
  if (snapshot.empty) return null

  const doc = snapshot.docs[0]
  return {
    id: doc.id,
    ...doc.data()
  } as MissionSubmission
}

// ============================================
// Admin Functions
// ============================================

export interface UserProgressWithInfo {
visitorId: string
  name?: string
  email?: string
  progress: WorkbookProgress
}

// Get all users' progress (for admin)
export async function getAllUsersProgress(): Promise<UserProgressWithInfo[]> {
  const { collection, getDocs } = await import('firebase/firestore')

  // Get all progress
  const progressSnapshot = await getDocs(collection(db(), 'workbook_progress'))

  // Get all profiles
  const profilesSnapshot = await getDocs(collection(db(), 'user_profiles'))
  const profiles = new Map<string, UserProfile>()
  profilesSnapshot.docs.forEach(doc => {
    profiles.set(doc.id, doc.data() as UserProfile)
  })

  return progressSnapshot.docs.map(doc => {
    const profile = profiles.get(doc.id)
    return {
visitorId: doc.id,
      name: profile?.name,
      email: profile?.email,
      progress: doc.data() as WorkbookProgress
    }
  })
}

// Get all mission submissions (for admin)
export async function getAllSubmissions(): Promise<MissionSubmission[]> {
  const { collection, query, orderBy, getDocs } = await import('firebase/firestore')

  const q = query(
    collection(db(), 'mission_submissions'),
    orderBy('submittedAt', 'desc')
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as MissionSubmission[]
}
