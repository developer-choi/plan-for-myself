interface SessionSnapshot {
  token: string | null;
  isGuest: boolean;
}

export function isGuestToGoogleTransition(previous: SessionSnapshot, current: SessionSnapshot): boolean {
  return previous.isGuest && current.token !== null && !current.isGuest;
}
