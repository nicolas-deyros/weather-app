export const prerender = false

export function GET() {
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

export const runtime = 'edge'
rerender = false

export function GET() {
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
