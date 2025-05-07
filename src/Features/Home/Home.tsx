import { useNavigate } from 'react-router'
import style from '../../style/Features/Home/Home.module.scss'

const Home = () => {
	const panier = sessionStorage.getItem('worksiteBaskets')
	const deletePanier = () => {
		sessionStorage.removeItem('worksiteBaskets')
	}
	const navigate = useNavigate()
	return (
		<div className={style.homeButtonContainer}>
			<button
				className={style.homeButton}
				onClick={() => {
					navigate('/scan')
					deletePanier
				}}
			>
				Nouveau Panier
			</button>
			{panier && panier !== '[]' && (
				<button
					className={style.homeButton}
					onClick={() => {
						navigate('/scan')
					}}
				>
					Reprendre Panier
				</button>
			)}
		</div>
	)
}

export default Home
