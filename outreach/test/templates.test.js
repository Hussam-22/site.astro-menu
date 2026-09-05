import test from 'node:test'
import assert from 'node:assert/strict'
import { SEQUENCE, renderMessage, claimUrl } from '../src/deliver/templates.js'

const venue = { name: 'Foamy Coffee', slug: 'foamy-coffee', opted_out_at: null }
const build = { item_count: 42, section_count: 6 }

test('the sequence is four touches over three weeks and stops', () => {
	assert.equal(SEQUENCE.length, 4)
	assert.deepEqual(
		SEQUENCE.map((s) => s.step),
		[1, 2, 3, 4]
	)
	const offsets = SEQUENCE.map((s) => s.dayOffset)
	assert.deepEqual(
		offsets,
		[...offsets].sort((a, b) => a - b)
	)
	assert.ok(offsets.at(-1) <= 21)
})

test('every touch carries a way out', () => {
	for (const step of SEQUENCE) {
		const message = renderMessage(step.step, venue, build)
		assert.ok(
			/no thanks|last you will hear/i.test(message.body),
			`step ${step.step} gives no way to opt out`
		)
	}
})

test('every touch links to the claim page for this venue', () => {
	for (const step of SEQUENCE) {
		const message = renderMessage(step.step, venue, build)
		assert.ok(message.body.includes(claimUrl(venue.slug)), `step ${step.step} has no claim link`)
	}
})

test('an opted-out venue renders nothing, at any step', () => {
	const gone = { ...venue, opted_out_at: new Date() }
	for (const step of SEQUENCE) {
		assert.equal(renderMessage(step.step, gone, build), null)
	}
})

test('the first touch names the venue and what we actually built', () => {
	const message = renderMessage(1, venue, build)
	assert.ok(message.subject.includes('Foamy Coffee'))
	assert.ok(message.body.includes('42'))
	assert.ok(message.body.includes('6'))
})

test('the first touch does not claim the menu is live to customers', () => {
	const message = renderMessage(1, venue, build)
	assert.match(message.body, /not live to your customers/i)
})

test('an unknown step is an error, not a silent empty message', () => {
	assert.throws(() => renderMessage(9, venue, build), /No sequence step/)
})
