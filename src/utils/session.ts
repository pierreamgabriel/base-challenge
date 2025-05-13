export function getSessionId(): string {
  let id = sessionStorage.getItem('sessionId');
  if (!id) {
    id = Math.random().toString(36).substring(2);
    sessionStorage.setItem('sessionId', id);
  }
  return id;
}