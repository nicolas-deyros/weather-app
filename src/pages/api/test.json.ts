export const prerender = false

import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ url }) => {
	console.log('Test API called')

	try {
		return new Response(
			JSON.stringify({
				message: 'Test API is working',
				timestamp: new Date().toISOString(),
				params: url.searchParams.toString(),
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)
	} catch (error) {
		console.error('Test API error:', error)
		return new Response(
			JSON.stringify({
				error: 'Test API failed',
				message: error instanceof Error ? error.message : 'Unknown error',
			}),
			{
				status: 500,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)
	}
}
