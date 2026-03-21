import mixpanel from 'mixpanel-browser'

const MIXPANEL_TOKEN = '591d3847e31cb18a9259dda4e6f08ce1'

let initialized = false

export const initMixpanel = () => {
  if (typeof window === 'undefined' || initialized) return

  mixpanel.init(MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV === 'development',
    track_pageview: true,
    persistence: 'localStorage',
  })
  initialized = true
}

export const track = (event: string, properties?: Record<string, unknown>) => {
  if (typeof window === 'undefined') return

  if (!initialized) {
    initMixpanel()
  }

  mixpanel.track(event, properties)
}

// 자주 쓰는 이벤트들
export const trackPageView = (page: string) => {
  track('Page View', { page })
}

export const trackButtonClick = (buttonName: string, location?: string) => {
  track('Button Click', { button: buttonName, location })
}

export const trackFormStep = (step: string, stepNumber: number) => {
  track('Form Step', { step, step_number: stepNumber })
}

export const trackFormSubmit = (formName: string, data?: Record<string, unknown>) => {
  track('Form Submit', { form: formName, ...data })
}

export const trackFormAbandonment = (step: string, stepNumber: number) => {
  track('Form Abandonment', { last_step: step, step_number: stepNumber })
}
