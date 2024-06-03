import 'dotenv/config';
import fetchAndSaveWorkshopItems from './lib/fetchAndSaveWorkshopItems';

const key = process.env.STEAM_WEB_API ?? '';
const appId = 233610;
const filename = 'workshopItems';
const minified = false;
fetchAndSaveWorkshopItems(key, appId, filename, minified)
	.catch(console.error);
