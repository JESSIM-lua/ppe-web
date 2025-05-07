import { Item } from '../Models/Item'

export const exportToCSV = (items: Item[], fileName?: string) => {
	console.log('Exporting to CSV:', fileName || 'checkheadProd.csv')
	const csvContent =
		'\n' +
		items
			.map((prod: Item) => `${prod.articleID}\t${prod.quantity}`)
			.join('\n')

	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
	const link = document.createElement('a')
	const url = URL.createObjectURL(blob)
	link.setAttribute('href', url)
	link.setAttribute('download', 'checkheadProd.csv')
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
	URL.revokeObjectURL(url)
}
