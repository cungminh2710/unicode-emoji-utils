// ... existing imports ...
import { useState } from 'react';
import { useFeedContext } from 'react-activity-feed';
import posthog from 'posthog-js';

import { useAuth } from '@/core/AuthContext';
// ... rest of imports ...

// ... existing code ...

return (
	<div
		role='button'
		className={cn('group my-1 flex space-x-1 hover:text-red-500', className)}
		onClick={() => {
			if (user) {
				if (activity) {
					onToggleReaction(
						'like',
						//@ts-expect-error
						activity,
						{},
						{
							targetFeeds:
								typeof activity.actor !== 'string' &&
								user.uid !== activity.actor.id
									? [`notification:${activity.actor.id}`]
									: [],
						},
					);
					
					// Track like/unlike event
					const eventName = isLiked ? 'content:unlike' : 'content:like';
					posthog.capture(eventName, { 
						postId: activity.id,
						creatorId: typeof activity.actor !== 'string' ? activity.actor.id : null
					});
				}

				// ... rest of existing code ...
