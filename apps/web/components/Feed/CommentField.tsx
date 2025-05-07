import { PaperPlaneIcon, UpdateIcon } from '@radix-ui/react-icons';
import type { EnrichedActivity } from 'getstream';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { DefaultAT, DefaultUT } from 'react-activity-feed';
import { useFeedContext } from 'react-activity-feed';
import posthog from 'posthog-js';

const handleFormSubmit = async (
	event: FormEvent<HTMLFormElement> | KeyboardEvent,
) => {
	event.preventDefault();
	if (!text) return;

	setLoading(true);

	try {
		await feed.onAddReaction(
			'comment',
			//@ts-expect-error
			activity,
			{ text },
			{ targetFeeds },
		);
		
		// Track comment event
		posthog.capture('content:comment', { 
			postId: activity.id,
			creatorId: typeof activity.actor !== 'string' ? activity.actor.id : null,
			commentLength: text.length
		});
	} catch (error) {
		console.error(error);
	} finally {
		setLoading(false);
	}

	setText('');
	onSuccess?.();
};
