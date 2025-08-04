export { renderers } from '../../renderers.mjs';

const prerender = false;
const GET = async ({ url }) => {
  console.log("Test API called");
  try {
    return new Response(
      JSON.stringify({
        message: "Test API is working",
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        params: url.searchParams.toString()
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Test API error:", error);
    return new Response(
      JSON.stringify({
        error: "Test API failed",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	GET,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
