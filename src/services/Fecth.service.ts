export const fetchPost = async <V, T extends Object>(
	req: string,
	data: T
): Promise<V> => {
	try {
		// const access_token = localStorage.getItem('access_token') || ''
		const response: Response = await fetch(
			'http://localhost:4000/graphql',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					softwareidentifier: 'fr.adde.market',
					// Authorization: 'Bearer ' + access_token,
				},
				body: JSON.stringify({
					query: req,
					variables: data,
				}),
			}
		)
		const res = await response.json()
		console.log('Response:', res)

		if (res.errors) {
			if (res.errors[0].message === 'Unauthorized') {
				localStorage.removeItem('access_token')
				window.location.reload()
			}
			throw new Error(res.errors[0].message)
		}

		return res.data as V
	} catch (error) {
		throw error
	}
}
