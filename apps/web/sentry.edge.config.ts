import * as Sentry from '@sentry/nextjs';
import {sentryInitOptions} from '@/shared/sentry/init-options';

Sentry.init(sentryInitOptions);
