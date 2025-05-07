import { fetchPost } from '../../services/Fecth.service'
import {
	DELETE_WORKSITES_QUERY,
	GET_WORKSITES_QUERY,
	UPDATE_WORKSITES_QUERY,
} from '../../constants'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Worksite, WorksiteStatus } from '../../Models/Worksite'
import style from '../../style/Features/Admin/DisplayWorksite.module.scss'

const DisplayWorksite = () => {
	const navigate = useNavigate()

	useEffect(() => {
		const fetchChantiers = async () => {
			const response = await fetchPost(GET_WORKSITES_QUERY, {
				worksiteStatuses: [
					'PENDING',
					'IN_PROGRESS',
					'ENDED',
					'ARCHIVED',
				],
			})
			if (response) {
				setChantiers((response as { worksites: Worksite[] }).worksites)
			}
		}
		fetchChantiers()
	}, [])

	const [chantiers, setChantiers] = useState<Worksite[]>([])

	const deleteWorksite = async (worksiteId: string) => {
		const response = await fetchPost(DELETE_WORKSITES_QUERY, {
			worksiteId: worksiteId,
		})
		if (response) {
			const newChantiers = chantiers.filter(
				(worksite) => worksite._id !== worksiteId
			)
			setChantiers(newChantiers)
		}
	}

	const modifyWorksite = async (
		worksiteId: string,
		name: string,
		startDate: Date,
		endDate: Date,
		worksiteStatus: WorksiteStatus
	) => {
		const response = await fetchPost(UPDATE_WORKSITES_QUERY, {
			worksiteData: {
				_id: worksiteId,
				name: name,
				startDate: startDate,
				endDate: endDate,
				worksiteStatus: worksiteStatus,
			},
		})
		if (response) {
			const newChantiers = chantiers.filter(
				(worksite) => worksite._id !== worksiteId
			)
			setChantiers(newChantiers)
			window.location.reload()
		}
	}

	const onChangeWorksite = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.target.style.backgroundColor = 'red'
	}

	const onChangeWorksiteSelect = (
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		e.target.style.backgroundColor = 'red'
	}

	return (
		<div className={style.DisplayWorksiteContainer}>
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
			<div className={style.DisplayWorksiteTitleContainer}>
				<h1>Sites</h1>
			</div>
			<table className={style.DisplayWorksiteArrayContainer}>
				<thead>
					<tr>
						<th>Site</th>
						<th>Status</th>
						<th>Date de début</th>
						<th>Date de fin</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{chantiers.map((worksite) => (
						<tr key={worksite._id}>
							<td>
								<input
									className={style.DisplayWorksiteArrayInput}
									type="text"
									defaultValue={worksite.name}
									onChange={onChangeWorksite}
									id="name"
								/>
							</td>
							<td>
								<select
									name="worksiteStatus"
									id="worksiteStatus"
									defaultValue={worksite.worksiteStatus}
									onChange={onChangeWorksiteSelect}
								>
									<option value={WorksiteStatus.PENDING}>
										{WorksiteStatus.PENDING}
									</option>
									<option value={WorksiteStatus.IN_PROGRESS}>
										{WorksiteStatus.IN_PROGRESS}
									</option>
									<option value={WorksiteStatus.ENDED}>
										{WorksiteStatus.ENDED}
									</option>
									<option value={WorksiteStatus.ARCHIVED}>
										{WorksiteStatus.ARCHIVED}
									</option>
								</select>
							</td>
							<td>
								<input
									className={style.DisplayWorksiteArrayInput}
									type="date"
									name="startDate"
									id="startDate"
									defaultValue={
										new Date(
											worksite.startDate
												? new Date(worksite.startDate)
												: new Date()
										)
											.toISOString()
											.split('T')[0]
									}
									onChange={onChangeWorksite}
								/>
							</td>
							<td>
								<input
									className={style.DisplayWorksiteArrayInput}
									type="date"
									name="endDate"
									id="endDate"
									defaultValue={
										new Date(
											worksite.endDate
												? new Date(worksite.endDate)
												: new Date()
										)
											.toISOString()
											.split('T')[0]
									}
									onChange={onChangeWorksite}
								/>
							</td>
							<td
								className={
									style.DisplayWorksiteArrayActionContainer
								}
							>
								<button
									onClick={(e) => {
										const row = (
											e.target as HTMLElement
										).closest('tr') as HTMLTableRowElement
										const name = (
											row.querySelector(
												'#name'
											) as HTMLInputElement
										)?.value
										const startDate = (
											row.querySelector(
												'#startDate'
											) as HTMLInputElement
										)?.value
										const endDate = (
											row.querySelector(
												'#endDate'
											) as HTMLInputElement
										)?.value
										const worksiteStatus = (
											row.querySelector(
												'#worksiteStatus'
											) as HTMLSelectElement
										)?.value as WorksiteStatus

										modifyWorksite(
											worksite._id,
											name,
											new Date(startDate),
											new Date(endDate),
											worksiteStatus
										)
									}}
								>
									Modifier
								</button>
								<button
									className={
										style.DisplayWorksiteArrayItemDeleteButton
									}
									onClick={() => deleteWorksite(worksite._id)}
								>
									Supprimer
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default DisplayWorksite
