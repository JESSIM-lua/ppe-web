import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import style from './style/theme.module.scss'
import { BrowserRouter } from 'react-router'
import AppRoutes from './AppRoutes.tsx'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<div className={style.mainContainer}>
				<AppRoutes />
			</div>
		</BrowserRouter>
	</StrictMode>
)
