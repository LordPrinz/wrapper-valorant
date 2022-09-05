import { puuid } from "../../types/alias";
import { Region } from "../../types/Region";
import {
	MatchesMatchDto,
	MatchlistDto,
	RecentMatchesDto,
} from "../../types/VAL-MATCH-V1";
import fetchData from "../../utils/fetchData";

export const getMatchByMatchId = async ({
	matchId,
	region = "eu",
	apiKey,
}: {
	matchId: string;
	region?: Region;
	apiKey: string;
}): Promise<MatchesMatchDto | null> => {
	let response: any;

	try {
		response = await fetchData({
			region: region,
			endpoint: `/val/match/v1/matches/${matchId}`,
			apiKey,
		});
	} catch (err) {
		console.error(err);
		return null;
	}

	return <MatchesMatchDto>response;
};

export const getMatchByPuuid = async ({
	puuid,
	region = "eu",
	apiKey,
}: {
	puuid: puuid;
	region?: Region;
	apiKey: string;
}): Promise<MatchlistDto | null> => {
	let response: any;

	try {
		response = await fetchData({
			region: region,
			endpoint: `/val/match/v1/matchlists/by-puuid/${puuid}`,
			apiKey,
		});
	} catch (err) {
		console.error(err);
		return null;
	}

	return <MatchlistDto>response;
};

export const getMatchByQueue = async ({
	queue,
	region = "eu",
	apiKey,
}: {
	queue: string;
	region?: Region;
	apiKey: string;
}): Promise<RecentMatchesDto | null> => {
	let response: any;

	try {
		response = await fetchData({
			region,
			endpoint: `/val/match/v1/recent-matches/by-queue/${queue}`,
			apiKey,
		});
	} catch (err) {
		console.error(err);
		return null;
	}

	return <RecentMatchesDto>response;
};
