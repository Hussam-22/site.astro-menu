import test from 'node:test'
import assert from 'node:assert/strict'
import { scoreVenue, countNames, normaliseName } from '../src/qualify/score.js'

const venue = (over = {}) => ({
	name: 'Test Cafe',
	business_status: 'OPERATIONAL',
	website: null,
	phone: '+971500000000',
	rating: 4.5,
	rating_count: 180,
	photo_names: ['a', 'b', 'c'],
	...over
})

test('a venue with a PDF menu and no website is the ideal lead', () => {
	const result = scoreVenue(venue(), { menuSources: [{ kind: 'pdf' }] })
	assert.equal(result.segment, 'prospect')
	// 45 pdf + 25 no site + 15 reviews + 10 rating + 5 phone + 5 photos
	assert.equal(result.score, 100)
})

test('a venue with no menu artifact anywhere is not buildable', () => {
	const result = scoreVenue(venue(), { menuSources: [] })
	assert.equal(result.segment, 'unreachable')
	assert.ok(result.reasons.includes('no menu artifact found yet'))
})

test('a Linktree counts as having no real website', () => {
	const result = scoreVenue(venue({ website: 'https://linktr.ee/somecafe' }), {
		menuSources: [{ kind: 'image' }]
	})
	assert.ok(result.reasons.some((r) => r.includes('linktr.ee')))
	assert.ok(result.score > 50)
})

test('a real website with a PDF still scores well, just without the no-site bonus', () => {
	const withSite = scoreVenue(venue({ website: 'https://somecafe.ae' }), {
		menuSources: [{ kind: 'pdf' }]
	})
	const without = scoreVenue(venue(), { menuSources: [{ kind: 'pdf' }] })
	assert.ok(withSite.score < without.score)
	assert.equal(withSite.segment, 'prospect')
})

test('a venue already on a competitor is segmented, not scored as a first-menu lead', () => {
	const result = scoreVenue(venue({ website: 'https://menutiger.com/somecafe' }), {
		menuSources: [{ kind: 'html' }]
	})
	assert.equal(result.segment, 'competitor')
	assert.equal(result.score, 30)
})

test('a delivery-platform listing counts as a competitor, not a website', () => {
	const result = scoreVenue(venue({ website: 'https://www.talabat.com/uae/somecafe' }), {
		menuSources: [{ kind: 'html' }]
	})
	assert.equal(result.segment, 'competitor')
})

test('a closed venue is disqualified outright', () => {
	const result = scoreVenue(venue({ business_status: 'CLOSED_PERMANENTLY' }), {
		menuSources: [{ kind: 'pdf' }]
	})
	assert.equal(result.segment, 'disqualified')
	assert.equal(result.score, 0)
})

test('an opted-out venue is disqualified however good it looks', () => {
	const result = scoreVenue(venue({ opted_out_at: new Date() }), {
		menuSources: [{ kind: 'pdf' }]
	})
	assert.equal(result.segment, 'disqualified')
})

test('five venues sharing a name are a chain, four are not', () => {
	const five = countNames(Array.from({ length: 5 }, () => ({ name: 'Big Burger Co' })))
	const four = countNames(Array.from({ length: 4 }, () => ({ name: 'Big Burger Co' })))

	assert.equal(scoreVenue(venue({ name: 'Big Burger Co' }), { nameCounts: five }).segment, 'chain')
	assert.notEqual(
		scoreVenue(venue({ name: 'Big Burger Co' }), {
			nameCounts: four,
			menuSources: [{ kind: 'pdf' }]
		}).segment,
		'chain'
	)
})

test('branch suffixes normalise to the same brand', () => {
	assert.equal(normaliseName('Foamy Coffee Cafe (Al Jimi)'), normaliseName('Foamy Coffee Cafe'))
	assert.notEqual(normaliseName('Foamy'), normaliseName('Number Eight'))
})

test('an Arabic name normalises to something non-empty', () => {
	assert.ok(normaliseName('مقهى نمبر إيت').length > 0)
})

test('a venue with few reviews is kept but flagged', () => {
	const result = scoreVenue(venue({ rating_count: 4 }), { menuSources: [{ kind: 'pdf' }] })
	assert.equal(result.segment, 'prospect')
	assert.ok(result.reasons.some((r) => r.includes('too new or inactive')))
})
