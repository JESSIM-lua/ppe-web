import { useNavigate } from 'react-router'
import style from '../../style/Features/Admin/WorksiteForm.module.scss'
import { fetchPost } from '../../services/Fecth.service'
import { CREATE_WORKSITE_QUERY } from '../../constants'

const WorksiteForm = () => {
	const navigate = useNavigate()

	const addWorksite = async (
		name: string,
		startDate: Date,
		endDate: Date
	) => {
		fetchPost(CREATE_WORKSITE_QUERY, {
			worksiteData: {
				name: name,
				startDate: startDate,
				endDate: endDate,
			},
		})
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const form = e.target as HTMLFormElement
		const name = (form.elements.namedItem('name') as HTMLInputElement).value
		const startDate = (
			form.elements.namedItem('startDate') as HTMLInputElement
		).value
		const endDate = (form.elements.namedItem('endDate') as HTMLInputElement)
			.value
		addWorksite(name, new Date(startDate), new Date(endDate))

		alert('Site ajouté avec succès :' + name)
		window.location.reload()
	}

	return (
		<div>
			<div className={style.DisplayWorksiteButtonsContainer}>
				<button onClick={() => navigate('/admin2025')}>
					En Attente
				</button>
				<button onClick={() => navigate('/exported2025')}>
					Exporté
				</button>
				<button onClick={() => navigate('/archive2025')}>
					Archive
				</button>
				<button
					className={style.adminButtonsContainerSelected}
					onClick={() => navigate('/displayworksite2025')}
				>
					Sites
				</button>
				<button onClick={() => navigate('/worksiteform2025')}>
					Ajouter un site
				</button>
			</div>
			<div className={style.worksiteContainer}>
				<h1>Création D'un Site</h1>

				<button onClick={() => navigate('/displayworksite2025')}>
					Sites
				</button>

				<form
					action=""
					className={style.worksiteFormContainer}
					onSubmit={handleSubmit}
				>
					<label>Name</label>
					<input type="text" name="name" id="name" />
					<label> Date de Début</label>
					<input type="date" name="startDate" id="startDate" />
					<label> Date de Fin</label>
					<input type="date" name="endDate" id="endDate" />
					<button className={style.worksiteFormSubmitButton}>
						submit
					</button>
				</form>
			</div>
		</div>
	)
}

export default WorksiteForm
