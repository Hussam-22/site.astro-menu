import { useState } from 'react'

export default function Counter() {
	const [count, setCount] = useState(0)
	console.log('clicked', count)

	return (
		<div className="text-white">
			<p>{count}</p>
			<button className="btn btn-primary" onClick={() => setCount(count + 1)}>
				Increment
			</button>
		</div>
	)
}
