import { UserPlusIcon } from '@heroicons/react/20/solid';
import { UpdateIcon } from '@radix-ui/react-icons';
import posthog from 'posthog-js';
import { useCallback } from 'react';

// ... existing code ...

const onClick = useCallback(() => {
	if (followed) {
		posthog.capture('user:unfollow', { unfollowedUserId: uid });
		unfollow({ uid });
	} else {
		posthog.capture('user:follow', { followedUserId: uid });
		follow({ uid });
	}
	// eslint-disable-next-line react-hooks/exhaustive-deps
}, [followed, uid]);

// ... rest of the file ...
