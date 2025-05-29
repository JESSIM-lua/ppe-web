import { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router'
import QRScanner from './Features/QRScanner/QRScanner'

import Login from './Features/Login/Login'
import Panier from './Features/Panier/Panier'
import Admin from './Features/Admin/Admin'
import Archive from './Features/Admin/Archive'
import Exported from './Features/Admin/Exported'
import WorksiteForm from './Features/Admin/WorksiteForm'
import DisplayWorksite from './Features/Admin/DisplayWorksite'
import Home from './Features/Home/Home'
// import WorksiteSearch from '../Features/Admin/WorksiteSearch'

const AppRoutes = () => {
	const navigate = useNavigate()
	// useEffect(() => {
	// 	localStorage.setItem('access_token', '12321312321312')
	// 	localStorage.setItem('name', 'jessim')
	// }, [navigate])

	useEffect(() => {
		const token = localStorage.getItem('access_token')
		//    const name = localStorage.getItem('name')

		console.log(token)
		if (token) {
			// navigate('/scan')
		} else {
			navigate('/login')
		}
	}, [navigate])

	// http://10.200.24.51:4828/api swagger
	// http://10.200.24.51:4828/api/auth/login --> basic auth --> username: admin, password: admin + HEADER --> softwareidentifier: fr.adde.market

	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/home" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/scan" element={<QRScanner />} />
			<Route path="/panier" element={<Panier />} />
			<Route path="/admin2025" element={<Admin />} />
			<Route path="/archive2025" element={<Archive />} />
			<Route path="/exported2025" element={<Exported />} />
			<Route path="/worksiteform2025" element={<WorksiteForm />} />
			<Route path="/displayworksite2025" element={<DisplayWorksite />} />
		</Routes>
	)
}

export default AppRoutes
