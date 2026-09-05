import test from 'node:test'
import assert from 'node:assert/strict'
import { parseRobots, isAllowed } from '../src/enrich/menu-finder.js'

test('a wildcard group applies to us', () => {
	const rules = parseRobots('User-agent: *\nDisallow: /admin\nDisallow: /cart')
	assert.deepEqual(rules, ['/admin', '/cart'])
	assert.equal(isAllowed('/menu', rules), true)
	assert.equal(isAllowed('/admin/login', rules), false)
})

test("another bot's rules are not ours", () => {
	const rules = parseRobots('User-agent: BadBot\nDisallow: /\n\nUser-agent: *\nDisallow: /private')
	assert.deepEqual(rules, ['/private'])
	assert.equal(isAllowed('/menu', rules), true)
})

test('a group naming us applies to us', () => {
	const rules = parseRobots('User-agent: Astro-Menu-Bot\nDisallow: /nope')
	assert.deepEqual(rules, ['/nope'])
})

test('comments and blank lines are ignored', () => {
	const rules = parseRobots('# hello\n\nUser-agent: *\nDisallow: /x  # why not\n')
	assert.deepEqual(rules, ['/x'])
})

test('an empty Disallow means nothing is disallowed', () => {
	const rules = parseRobots('User-agent: *\nDisallow:')
	assert.deepEqual(rules, [])
	assert.equal(isAllowed('/anything', rules), true)
})

test('a sitemap line is not a rule', () => {
	const rules = parseRobots('User-agent: *\nAllow: /\nSitemap: https://x.com/sitemap.xml')
	assert.deepEqual(rules, [])
})
