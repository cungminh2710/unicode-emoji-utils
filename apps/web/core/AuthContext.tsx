// ... existing imports ...
import type { PostHog } from 'posthog-js';
import { usePostHog } from 'posthog-js/react';
import posthog from 'posthog-js';
// ... more existing imports ...

// ... existing code ...

export const signIn = async (email: string, password: string) => {
	return await signInWithEmailAndPassword(auth, email, password).then(() => {
		const currentUser = auth.currentUser;
		if (currentUser !== null) {
			posthog.capture('user:login', { method: 'email' });
			return Promise.resolve(currentUser);
		} else {
			throw Error('User Credential not found');
		}
	});
};

export const signOut = async (): Promise<void> => {
	const user = auth.currentUser;

	if (user) {
		posthog.capture('user:logout');
		destroyCookie(undefined, 'token');
		destroyCookie(undefined, 'uid');

		// ... rest of existing signOut function ...
	}

	return Promise.resolve();
};

// ... rest of the file ...
