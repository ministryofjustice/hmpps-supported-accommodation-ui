export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    previousPage: string
  }
}

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      flash(type: string, message: string | ErrorMessages | Array<ErrorSummary> | Record<string, unknown>): number
      logout(done: (err: unknown) => void): void
    }
  }
}
