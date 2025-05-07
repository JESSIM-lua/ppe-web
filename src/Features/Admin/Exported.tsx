import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import OperatorActionList from './OperatorActionList'
import { Cart } from '../../Models/Cart'
import style from '../../style/Features/Admin/Archive.module.scss'
import { fetchPost } from '../../services/Fecth.service'
import {
	DELETE_CART_QUERY,
	GET_CART_QUERY,
	UPDATE_CART_QUERY,
} from '../../constants'

const Exported = () => {
	const navigate = useNavigate()
	const [carts, setCarts] = useState<Cart[]>([])

	const fetchCarts = async () => {
		try {
			const response = await fetchPost<
				{ Carts: Cart[] },
				{ cartStatuses: string[] }
			>(GET_CART_QUERY, {
				cartStatuses: ['EXPORTED'],
			})
			console.log('Full response:', response)

			if (response?.Carts) {
				setCarts(response.Carts)
			}
		} catch (error) {
			console.error('WAAZAZKJ', error)
		}
	}
	useEffect(() => {
		fetchCarts()
	}, [])

	const doDelete = async (rep: Cart) => {
		const response = await fetchPost(DELETE_CART_QUERY, {
			cartId: rep._id,
		})
		if (response) {
			setCarts(carts.filter((item) => item._id !== rep._id))
			fetchCarts()
		} else {
			console.error('Failed to delete cart')
		}
	}

	const doChangeEtat = async (rep: Cart) => {
		const response = await fetchPost(UPDATE_CART_QUERY, {
			cartData: {
				_id: rep._id,
				cartStatus: 'ARCHIVED',
			},
			cartStatuses: ['EXPORTED'],
		})
		if (response) {
			console.log('Cart status updated successfully')
			fetchCarts()
		} else {
			console.error('Failed to update cart status')
		}
	}

	return (
		<div className={style.archiveContainer}>
			<div className={style.archiveButtonsContainer}>
				<button onClick={() => navigate('/admin2025')}>
					En Attente
				</button>
				<button
					className={style.archiveButtonsContainerSelected}
					onClick={() => navigate('/exported2025')}
				>
					Exporté
				</button>
				<button onClick={() => navigate('/archive2025')}>
					Archive
				</button>
				<button onClick={() => navigate('/displayworksite2025')}>
					Sites
				</button>
			</div>

			<OperatorActionList
				data={carts}
				handleChangeStatus={doChangeEtat}
				handleDelete={doDelete}
				actionVerifText="Valider l'export"
				refetchData={fetchCarts}
			/>
		</div>
	)
}

export default Exported
