import { getToken } from "@auth/core/jwt";

export async function GET(request) {
  try {
    const jwt = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.AUTH_URL && process.env.AUTH_URL.startsWith("https"),
    });

    if (!jwt) {
      // Return null session (client expects JSON)
      return new Response(JSON.stringify(null), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const session = {
      user: {
        id: jwt.sub,
        email: jwt.email,
        name: jwt.name,
      },
      expires: jwt.exp ? new Date(jwt.exp * 1000).toISOString() : undefined,
    };

    return new Response(JSON.stringify(session), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
