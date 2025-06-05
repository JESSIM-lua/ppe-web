import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import style from '../../style/Features/Login/Login.module.scss'

const Login = () => {
	const [username, setUsername] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [errorConnexion, setErrorConnexion] = useState<boolean>(false)
	const [connexionFailed, setConnexionFailed] = useState<boolean>(false)
	const navigate = useNavigate()

	// fetch les données de l'api et y mettre dans le token http://10.200.24.51:4828/api/auth/login --> basic auth --> username: admin, password: admin + HEADER --> softwareidentifier: fr.adde.market

	/**
	 * Fetch la data de login
	 *  met en variable dans le localstorage
	 * 'access_token' et 'name' de celui qui se login
	 * @param e - The form event
	 */
	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault()
		try {
			const response = await fetch(
				'https://172.18.158.191:4000/api/auth/login',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						username,
						password,
					}),
				}
			)

			const data = await response.json()
			if (!response.ok || data.message === 'Unauthorized') {
				setErrorConnexion(true)
			} else {
				localStorage.setItem('access_token', data.access_token)
				localStorage.setItem('name', data.username)
				navigate('/')
			}
		} catch (error) {
			console.error(error)
			setConnexionFailed(true)
		}
	}

	return (
		<div className={style.loginContainer}>
			<h1>Login</h1>
			<form onSubmit={handleSubmit} className={style.loginFormContainer}>
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				{errorConnexion && (
					<p>Identifiants incorrects. Veuillez réessayer.</p>
				)}

				{connexionFailed && (
					<p>Une erreur est survenue. Veuillez réessayer.</p>
				)}

				<button type="submit">Login</button>
			</form>
		</div>
	)
}
export default Login
