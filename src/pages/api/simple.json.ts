export const prerender = false

import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
	return new Response(
		JSON.stringify({
			message: 'Hello World',
			timestamp: new Date().toISOString(),
		}),
		{
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		},
	)
}
