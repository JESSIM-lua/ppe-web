export const fetchPost = async <V, T extends Object>(
	req: string,
	data: T
): Promise<V> => {
	try {
		const access_token = localStorage.getItem('access_token') || ''
		const response: Response = await fetch(
			'http://localhost:4000/graphql',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					softwareidentifier: 'fr.adde.market',
					Authorization: 'Bearer ' + access_token,
				},
				body: JSON.stringify({
					query: req,
					variables: data,
				}),
			}
		)
		const res = await response.json()
		console.log('Response:', res)

		if (response.status === 403) {
	const message = res?.error || res?.errors?.[0]?.message || 'Erreur inconnue'

	if (message === 'Invalid or expired token') {
		localStorage.removeItem('access_token')
		window.location.href = '/login'
	}

	throw new Error(message)
}


		return res.data as V
	} catch (error) {
		throw error
	}
}
