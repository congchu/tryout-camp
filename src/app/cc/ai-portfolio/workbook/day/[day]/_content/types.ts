export interface Step {
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
  accept?: string  // for file type (e.g., 'image/*')
}

export interface DayContent {
  title: string
  subtitle: string
  steps: Step[]
  mission: {
    title: string
    description: string
    placeholder?: string  // legacy
    fields?: MissionField[]  // new structured fields
  }
}
