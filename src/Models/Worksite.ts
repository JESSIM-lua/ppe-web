export type Worksite = {
	_id: string
	name: string
	worksiteStatus: WorksiteStatus
	startDate?: Date
	endDate?: Date
}

export enum WorksiteStatus {
	PENDING = 'PENDING',
	IN_PROGRESS = 'IN_PROGRESS',
	ENDED = 'ENDED',
	ARCHIVED = 'ARCHIVED',
}
