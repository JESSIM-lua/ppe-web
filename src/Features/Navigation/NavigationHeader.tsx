import React from 'react'
// import { useNavigate } from 'react-router'
import style from '../../style/Features/Navigation/NavigationHeader.module.scss'

const NavigationHeader: React.FC = () => {
	// const navigation = useNavigate()

	/**
	 * Méthode Logout qui efface les données d'auth
	 */
	const logout = () => {
		localStorage.removeItem('access_token')
		localStorage.removeItem('name')
		location.reload()
	}

	return (
		<div className={style.navigationHeaderContainer}>
			<button type="button" onClick={logout}>
				Deconnexion
			</button>
			{/* <button onClick={() => navigation('/scan')}>Scanner</button> */}
		</div>
	)
}

export default NavigationHeader
