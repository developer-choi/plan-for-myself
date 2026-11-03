import type {Href} from 'expo-router';
import type {GoogleConnectOutcome} from '@/auth/useGoogleConnect';

export function getConnectOutcomeHref(outcome: GoogleConnectOutcome): Href | null {
  switch (outcome) {
    case 'rejected':
      return '/sign-in';
    case 'failed':
      return {pathname: '/sign-in', params: {error: 'failed'}};
    case 'connected':
    case 'cancelled':
    case 'rejection-expired':
      return null;
  }
}
