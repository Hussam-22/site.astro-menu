/**
 * Minimal static server for dist/, used to screenshot the production build.
 * The dev server cannot run in this worktree while the parent repo's
 * package.json still contains merge-conflict markers (Vite walks up to it).
 *   node scripts/serve-dist.mjs [port]
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, extname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const PORT = Number(process.argv[2] || 4331)

const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.webp': 'image/webp',
	'.avif': 'image/avif',
	'.woff2': 'font/woff2',
	'.txt': 'text/plain; charset=utf-8',
	'.xml': 'application/xml'
}

const exists = async (p) => {
	try {
		const s = await stat(p)
		return s.isFile()
	} catch {
		return false
	}
}

createServer(async (req, res) => {
	const url = decodeURIComponent((req.url || '/').split('?')[0])
	const candidates = [join(ROOT, url), join(ROOT, url, 'index.html'), join(ROOT, url + '.html')]
	for (const file of candidates) {
		if (!file.startsWith(ROOT)) break
		if (await exists(file)) {
			res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' })
			res.end(await readFile(file))
			return
		}
	}
	res.writeHead(404, { 'content-type': 'text/html' })
	res.end(await readFile(join(ROOT, '404.html')).catch(() => 'Not found'))
}).listen(PORT, () => console.log(`serving dist on http://localhost:${PORT}`))
