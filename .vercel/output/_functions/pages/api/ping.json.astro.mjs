export { renderers } from '../../renderers.mjs';

const prerender = false;
function GET() {
  try {
    return new Response("OK", {
      status: 200,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  } catch (error) {
    return new Response("Error: " + error.message, {
      status: 500,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
