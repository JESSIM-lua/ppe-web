import { Item } from '../Models/Item'
import { Worksite } from '../Models/Worksite'

export const makePayloadForScannedProducts = (
	scannedProducts: Item[],
	chantier: Worksite,
	operatorName: string
) => {
	const productList = scannedProducts.map((product) => ({
		articleID: product.articleID,
		quantity: product.quantity,
	}))

	// localStorage.setItem('operator', operatorName)
	// localStorage.setItem('listProducts', JSON.stringify(productList))
	sessionStorage.setItem('listProducts', JSON.stringify(productList))
	sessionStorage.setItem('chantier', JSON.stringify(chantier))
	const data = {
		content:
			`👷 **Opérateur :** ${operatorName}\n\n🚧 **Chantier :** ${chantier}\n` +
			scannedProducts
				.map(
					(p) =>
						`📦 **Produit :** ${p.articleID}\n🔢 **Quantité :** ${p.quantity} `
				)
				.join('\n\n') +
			'\n\n-----------------------------------------',
	}

	return JSON.stringify(data)
}

const webhookUrl =
	'https://discord.com/api/webhooks/1346084145499209790/sG7NzkH9qoUYE3s9M8dOilQ6Ugkgyfjffw20fVEUfTdNDbrNC-wgZKRJWbJp1orig-nP'

export const sendtoDiscord = async (payload: string) => {
	try {
		const response = await fetch(webhookUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: payload,
		})

		sessionStorage.clear
		return response.ok
	} catch (error) {
		console.error('Erreur :', error)
		return false
	}
}
