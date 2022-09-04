import { int } from "./alias";

export type PlatformDataDto = {
	id: string;
	name: string;
	locales: string[];
	maintenances: StatusDto[];
	incidents: StatusDto[];
};

export type StatusDto = {
	id: int;
	maintenance_status: string;
	incident_severity: string;
	titles: ContentDto[];
	updates: UpdateDto[];
};

export type ContentDto = {
	locale: string;
	content: string;
};

export type UpdateDto = {
	id: int;
	author: string;
	publish: boolean;
	publish_locations: string[];
	translations: ContentDto[];
	created_at: string;
	updated_at: string;
};
