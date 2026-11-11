/**
 * Vercel Serverless Function Proxy for Gemini 3 Flash API
 * Route: POST /api/gemini
 * Hides process.env.GEMINI_API_KEY from the client browser.
 * Enforces strict 50MB payload limits to safeguard $100/mo API budgets.
 */

export default async function handler(req, res) {
    // 1. Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Strict 50MB Payload Protection Guard
    const contentLength = req.headers['content-length'];
    const maxSizeBytes = 50 * 1024 * 1024; // 50MB limit
    if (contentLength && parseInt(contentLength, 10) > maxSizeBytes) {
        return res.status(413).json({
            error: 'Payload Too Large',
            message: 'Strict Cap Exceeded: Uploads over 50MB are blocked to protect API credits.'
        });
    }

    // 3. Read Hidden API Key from Vercel Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({
            error: 'Server Misconfiguration',
            message: 'GEMINI_API_KEY environment variable is missing in Vercel project settings.'
        });
    }

    const { prompt } = req.body || {};
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: {
            parts: [{ text: "You are eCTD Sync AI: a world-class FDA/EMA regulatory software architect, Red Hat OpenShift compliance expert, and eCTD XML backbone specialist." }]
        }
    };

    // Exponential Backoff Retry Logic
    let attempts = 0;
    const maxAttempts = 3;
    let delay = 1000;

    while (attempts < maxAttempts) {
        try {
            const geminiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (geminiResponse.ok) {
                const data = await geminiResponse.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                return res.status(200).json({ text: text || 'No response generated.' });
            }
        } catch (err) {
            console.error(`Gemini API Attempt ${attempts + 1} failed:`, err.message);
        }

        attempts++;
        if (attempts < maxAttempts) {
            await new Promise(r => setTimeout(r, delay));
            delay *= 2;
        }
    }

    return res.status(502).json({
        error: 'Bad Gateway',
        message: 'Regulatory AI service temporarily unreachable after retries.'
    });
}
