export interface Response {
	response: WorkshopResponse;
}

export interface WorkshopResponse {
	total: number;
	publishedfiledetails: PublishedFileDetail[];
	next_cursor: string;
}

export interface PublishedFileDetail {
	result: number;
	publishedfileid: string;
	creator: string;
	creator_appid: number;
	consumer_appid: number;
	consumer_shortcutid: number;
	filename: string;
	file_size: string;
	preview_file_size: string;
	file_url: string;
	preview_url: string;
	url: string;
	hcontent_file: string;
	hcontent_preview: string;
	title: string;
	file_description: string;
	time_created: number;
	time_updated: number;
	visibility: number;
	flags: number;
	workshop_file: boolean;
	workshop_accepted: boolean;
	show_subscribe_all: boolean;
	num_comments_public: number;
	banned: boolean;
	ban_reason: string;
	banner: string;
	can_be_deleted: boolean;
	app_name: string;
	file_type: number;
	can_subscribe: boolean;
	subscriptions: number;
	favorited: number;
	followers: number;
	lifetime_subscriptions: number;
	lifetime_favorited: number;
	lifetime_followers: number;
	lifetime_playtime: string;
	lifetime_playtime_sessions: string;
	views: number;
	num_children: number;
	num_reports: number;
	tags: Tag[];
	language: number;
	maybe_inappropriate_sex: boolean;
	maybe_inappropriate_violence: boolean;
	revision_change_number: string;
	revision: number;
	ban_text_check_result: number;
}

export interface Tag {
	tag: string;
	display_name: string;
}
