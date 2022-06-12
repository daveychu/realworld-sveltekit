import { get } from 'svelte/store';
import { user } from './stores';

export async function post(endpoint: string, data: unknown) {
	return await (
		await fetch(endpoint, {
			method: 'POST',
			body: JSON.stringify(data || {}),
			headers: {
				'Content-Type': 'application/json',
				Authorization: get(user)?.token
			}
		})
	).json();
}

export async function put(endpoint: string, data: unknown) {
	return await (
		await fetch(endpoint, {
			method: 'PUT',
			body: JSON.stringify(data || {}),
			headers: {
				'Content-Type': 'application/json',
				Authorization: get(user)?.token
			}
		})
	).json();
}
