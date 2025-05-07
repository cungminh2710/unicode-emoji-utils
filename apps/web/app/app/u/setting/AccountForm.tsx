'use client';

import { CheckBadgeIcon } from '@heroicons/react/20/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateIcon } from '@radix-ui/react-icons';
import posthog from 'posthog-js';
import { useEffect, useMemo } from 'react';

// ... existing code ...

const onSubmit = (values: UserMutation) => {
	// Do something with the form values.
	// ✅ This will be type-safe and validated.
	console.log(values);
	
	// Track profile update event
	const changedFields = Object.keys(form.formState.dirtyFields);
	posthog.capture('profile:update', { 
		fields_updated: changedFields,
		has_avatar: !!values.photoUrl
	});
	
	mutate(values);
};
