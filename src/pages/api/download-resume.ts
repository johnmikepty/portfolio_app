import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ request }) => {
    // Forward the lang cookie so the resume renders in the correct locale
    const cookieHeader = request.headers.get('cookie') ?? ''

    // Determine base URL (works both in dev and production)
    const origin = new URL(request.url).origin
    const resumeUrl = `${origin}/resume`

    try {
        // Lazy-import puppeteer (server-side only, not bundled by Vite)
        const puppeteer = await import('puppeteer')
        const browser = await puppeteer.default.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // avoids crashes in low-memory VPS envs
            ],
        })

        const page = await browser.newPage()

        // Pass the lang cookie so the resume uses the visitor's active locale
        if (cookieHeader) {
            const cookies = cookieHeader.split(';').flatMap((pair) => {
                const [name, ...rest] = pair.trim().split('=')
                const value = rest.join('=')
                if (!name || !value) return []
                return [{ name: name.trim(), value: value.trim(), url: resumeUrl }]
            })
            await page.setCookie(...cookies)
        }

        await page.goto(resumeUrl, { waitUntil: 'networkidle0' })

        // Hide the nav bar before generating the PDF
        await page.addStyleTag({
            content: '.resume-nav { display: none !important; } body.resume-page main { margin-top: 0 !important; }',
        })

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0.4in', bottom: '0.4in', left: '0.4in', right: '0.4in' },
        })

        await browser.close()

        return new Response(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="resume.pdf"',
                'Cache-Control': 'no-store',
            },
        })
    } catch (err) {
        console.error('[download-resume] Puppeteer error:', err)
        return new Response(JSON.stringify({ error: 'Failed to generate PDF' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}
