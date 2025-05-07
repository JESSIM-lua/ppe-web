import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import style from '../../style/Features/Admin/Admin.module.scss'
import { Cart } from '../../Models/Cart'
import OperatorActionList from './OperatorActionList'
import {
	DELETE_CART_QUERY,
	GET_CART_QUERY,
	UPDATE_CART_QUERY,
} from '../../constants'
import { fetchPost } from '../../services/Fecth.service'

const Admin = () => {
	const navigate = useNavigate()
	const [carts, setCarts] = useState<Cart[]>([])

	const fetchCarts = async () => {
		try {
			const response = await fetchPost<
				{ Carts: Cart[] },
				{ cartStatuses: string[] }
			>(GET_CART_QUERY, {
				cartStatuses: ['PENDING'],
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
				cartStatus: 'EXPORTED',
			},
			cartStatuses: ['PENDING'],
		})
		if (response) {
			fetchCarts()
			console.log('Cart status updated successfully')
		} else {
			console.error('Failed to update cart status')
		}
	}

	return (
		<div className={style.adminContainer}>
			<div className={style.adminButtonsContainer}>
				<button
					className={style.adminButtonsContainerSelected}
					onClick={() => navigate('/admin2025')}
				>
					Admin
				</button>
				<button onClick={() => navigate('/exported2025')}>
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
				actionVerifText="Valider"
				refetchData={fetchCarts}
			/>
		</div>
	)
}

export default Admin
