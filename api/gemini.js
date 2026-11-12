/**
 * Vercel Serverless Function: POST /api/gemini
 * Reads process.env.GEMINI_API_KEY securely on the backend server so your
 * prepaid Google AI Studio key is never exposed in the React client bundle.
 * Enforces a strict 50MB payload ceiling.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  // Strict 50MB Payload Limit Guard
  const contentLength = req.headers['content-length'];
  const maxBytes = 50 * 1024 * 1024;
  if (contentLength && parseInt(contentLength, 10) > maxBytes) {
    return res.status(413).json({
      error: 'Payload Too Large',
      message: 'Uploads exceeding 50MB are blocked to protect API credits.'
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Missing Server Environment Variable',
      message: 'Set GEMINI_API_KEY in Vercel Project Settings -> Environment Variables.'
    });
  }

  const { prompt, roleContext } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'A valid text prompt is required.' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: `[Active Stakeholder Role: ${roleContext || 'Regulatory QA'}]\n\n${prompt}`
          }
        ]
      }
    ],
    systemInstruction: {
      parts: [
        {
          text: 'You are eCTD Sync Regulatory & Enterprise Architect: an expert in ICH eCTD v3.2.2/v4.0 XML DTD schemas, FDA 21 CFR Part 11 validation, and Red Hat OpenShift air-gapped pharmaceutical infrastructure. Provide concise, actionable technical guidance.'
        }
      ]
    }
  };

  let attempts = 0;
  const maxAttempts = 3;
  let delay = 1000;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
        return res.status(200).json({ text });
      }
    } catch {
      // Retry with exponential backoff
    }

    attempts += 1;
    if (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }

  return res.status(502).json({
    error: 'Upstream AI Timeout',
    message: 'Gemini API did not respond after retries.'
  });
}
