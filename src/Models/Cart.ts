import { Item } from './Item'
import { Worksite } from './Worksite'

type CartStatus = 'EXPORTED' | 'ARCHIVED' | 'PENDING'

export type Cart = {
	_id?: string
	cartStatus: CartStatus
	date: Date
	items: Item[]
	worksite: Worksite
	operator?: string
}
