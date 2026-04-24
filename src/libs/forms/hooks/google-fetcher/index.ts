/**
 * Fetches a public Google Form page through the Vite dev proxy and extracts
 * the FB_PUBLIC_LOAD_DATA_ variable that Google embeds in every viewform page.
 *
 * Requirements:
 *  - The form must NOT require Google sign-in (Forms → Settings → Responses → uncheck "Limit to 1 response" / uncheck sign-in requirement)
 *  - In development this uses the Vite proxy defined in vite.config.ts
 *  - In production replace the proxy path with a real backend endpoint
 */
export async function fetchGoogleFormData(
  viewformUrl: string,
): Promise<unknown[]> {
  const url = new URL(viewformUrl);

  // Route through the Vite dev proxy to avoid CORS.
  // The proxy strips "/google-forms-proxy" and forwards to docs.google.com.
  const proxyPath = `/google-forms-proxy${url.pathname}${url.search}`;

  const response = await fetch(proxyPath, {
    headers: { Accept: 'text/html,application/xhtml+xml' },
  });

  if (!response.ok) {
    throw new Error(
      `Google Forms fetch failed (${response.status}). ` +
        'Make sure the form is set to public (no sign-in required).',
    );
  }

  const html = await response.text();

  // Google embeds the full form definition as a JS variable in every public form page.
  const match = html.match(/FB_PUBLIC_LOAD_DATA_ = (.+);/);
  if (!match) {
    throw new Error(
      'Could not extract form data from page. ' +
        'The form may require sign-in or Google changed their format.',
    );
  }

  return JSON.parse(match[1]) as unknown[];
}
