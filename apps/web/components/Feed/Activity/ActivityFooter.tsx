// ... existing imports ...
import {
	ChatBubbleIcon,
	EyeOpenIcon,
	LockClosedIcon,
	Share2Icon,
} from '@radix-ui/react-icons';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { CommentList } from 'react-activity-feed';
import { ErrorBoundary } from 'react-error-boundary';
import { FormattedMessage } from 'react-intl';
import posthog from 'posthog-js';
// ... rest of imports ...

// ... existing code ...

<div className='raf-activity-footer__right'>
	<div className='flex space-x-4'>
		<button
			onClick={() => {
				posthog.capture('content:share', { 
					postId: activity.id,
					creatorId: typeof actor !== 'string' ? actor.id : null
				});
				setShowShareModal(true);
			}}
			className='group my-1 flex align-middle text-sm font-medium'
		>
			<span className='group-hover:text-primary inline-flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-purple-300'>
				<Share2Icon className='h-6 w-6' />
			</span>
		</button>

		// ... rest of the file ...
