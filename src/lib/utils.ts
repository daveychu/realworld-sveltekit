import { get } from 'svelte/store';
import { token } from './stores';

export async function post(endpoint: string, data: unknown) {
	return await (
		await fetch(endpoint, {
			method: 'POST',
			body: JSON.stringify(data || {}),
			headers: {
				'Content-Type': 'application/json',
				Authorization: get(token)
			}
		})
	).json();
}
