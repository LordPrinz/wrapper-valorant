import { puuid } from "../types/alias";
import { Region } from "../types/Region";
import { ActiveShardDto } from "../types/RIOT-ACCOUNT-V1";
import { AccountDto } from "../types/RIOT-ACCOUNT-V1";
import fetchData from "../utils/fetchData.js";

export const getAccountByPuuid = async ({
	apiKey,
	puuid,
	region = "eu",
}: {
	puuid: puuid;
	region?: Region;
	apiKey: string;
}): Promise<AccountDto | null> => {
	let response: any;

	try {
		response = await fetchData({
			region,
			endpoint: `/riot/account/v1/accounts/by-puuid/${puuid}`,
			apiKey,
		});
	} catch (err) {
		console.error(err);
		return null;
	}

	return <AccountDto>response;
};

export const getAccountByName = async ({
	apiKey,
	tagLine,
	gameName,
	region = "eu",
}: {
	tagLine: string;
	gameName: string;
	region?: Region;
	apiKey: string;
}): Promise<AccountDto | null> => {
	let response: any;

	try {
		response = await fetchData({
			region,
			endpoint: `/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
			apiKey,
		});
	} catch (err) {
		console.error(err);
		return null;
	}

	return <AccountDto>response;
};

export const getMyAccount = async ({
	apiKey,
	authorization,
	region = "eu",
}: {
	authorization: string;
	region?: Region;
	apiKey: string;
}): Promise<AccountDto | null> => {
	let response: any;

	try {
		response = await fetchData({
			region,
			endpoint: `/riot/account/v1/accounts/me`,
			params: [`Authorization=${authorization}`],
			apiKey,
		});
	} catch (err) {
		console.error(err);
		return null;
	}

	return <AccountDto>response;
};

export const getAccountActiveShard = async ({
	apiKey,
	puuid,
	region = "eu",
}: {
	puuid: puuid;
	region?: Region;
	apiKey: string;
}): Promise<ActiveShardDto | null> => {
	let response: any;

	try {
		response = await fetchData({
			region,
			endpoint: `/riot/account/v1/active-shards/by-game/val/by-puuid/${puuid}`,
			apiKey,
		});
	} catch (err) {
		console.error(err);
		return null;
	}

	return <ActiveShardDto>response;
};
