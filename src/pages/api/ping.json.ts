// Simplest possible Astro API endpoint
export const prerender = false

export function GET() {
	try {
		return new Response('OK', {
			status: 200,
			headers: {
				'Content-Type': 'text/plain',
			},
		})
	} catch (error) {
		return new Response('Error: ' + error.message, {
			status: 500,
			headers: {
				'Content-Type': 'text/plain',
			},
		})
	}
}
