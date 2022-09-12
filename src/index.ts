import {
	getAccountByName,
	getAccountByPuuid,
	getAccountActiveShard,
	getMyAccount,
} from "./controllers/ACCOUNT-V1.js";
import { getContentsHandler } from "./controllers/VAL-CONTENT-V1.js";
import {
	getMatchByMatchId,
	getMatchByPuuid,
	getMatchByQueue,
} from "./controllers/VAL-MATCH-V1.js";
import { getRankedHandler } from "./controllers/VAL-RANKED-V1.js";
import { getStatusHandler } from "./controllers/VAL-STATUS-V1.js";
import { int, puuid } from "./types/alias";
import { Locale } from "./types/LocalizedNamesDto";
import { Region } from "./types/Region";
import { Queue } from "./types/RIOT-ACCOUNT-V1";

class ValorantApi {
	private key: string;

	constructor(key: string) {
		if (!key) {
			throw new Error("No api key provided!");
		}
		this.key = key;
	}

	async getContents(data: { locale: Locale; region?: Region }) {
		return await getContentsHandler({ ...data, apiKey: this.key });
	}

	async getStatus(data: { region?: Region }) {
		return await getStatusHandler({ ...data, apiKey: this.key });
	}

	async getLeaderboard(data: {
		actId: string;
		region?: Region;
		size?: int;
		startIndex?: int;
	}) {
		return await getRankedHandler({ ...data, apiKey: this.key });
	}

	public match = {
		getByMatchId: async (data: { matchId: string; region?: Region }) => {
			return await getMatchByMatchId({
				...data,
				apiKey: this.key,
			});
		},
		getByPuuid: async (data: { puuid: string; region?: Region }) => {
			return await getMatchByPuuid({
				...data,
				apiKey: this.key,
			});
		},
		getByQueue: async (data: { queue: Queue; region?: Region }) => {
			return await getMatchByQueue({
				...data,
				apiKey: this.key,
			});
		},
	};

	public account = {
		getByPuuid: async (data: { puuid: puuid; region?: Region }) => {
			return await getAccountByPuuid({
				...data,
				apiKey: this.key,
			});
		},
		getByName: async (data: {
			tagLine: string;
			gameName: string;
			region?: Region;
		}) => {
			return await getAccountByName({
				...data,
				apiKey: this.key,
			});
		},
		getMyAccount: async (data: { authorization: string; region?: Region }) => {
			return await getMyAccount({
				...data,
				apiKey: this.key,
			});
		},
		getActiveShard: async (data: { puuid: puuid; region?: Region }) => {
			return await getAccountActiveShard({
				...data,
				apiKey: this.key,
			});
		},
	};
}

export default ValorantApi;
