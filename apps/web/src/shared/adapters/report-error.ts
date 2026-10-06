/**
 * Where failures go to be seen by whoever runs the app. Console for now; an error-tracking
 * service replaces this one function when there is one.
 */
export function reportError(error: unknown, context: string): void {
  console.error(`[${context}]`, error);
}
