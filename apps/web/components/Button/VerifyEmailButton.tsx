import { UpdateIcon } from '@radix-ui/react-icons';
import { sendEmailVerification } from 'firebase/auth';
import posthog from 'posthog-js';
import { useState } from 'react';

const onSend = async () => {
	if (!user) return;
	setSending(true);
	await sendEmailVerification(user);
	
	// Track email verification event
	posthog.capture('profile:verify_email_sent');
	
	setSent(true);
	setSending(false);
	setTimeout(() => {
		setSent(false);
	}, 10 * 1000);
};
