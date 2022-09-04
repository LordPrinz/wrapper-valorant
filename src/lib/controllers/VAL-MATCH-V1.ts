import { Region } from "../../types/Region";
import { MatchesMatchDto } from "../../types/VAL-MATCH-V1";
import fetchData from "../../utils/fetchData";

export const getMatchByMatchId = async ({
	matchId,
	region,
	apiKey,
}: {
	matchId: string;
	region: Region;
	apiKey: string;
}): Promise<MatchesMatchDto | null> => {
	let response: any;

	try {
		response = await fetchData({
			region: region,
			endpoint: `/match/v1/matches/${matchId}`,
			apiKey,
		});
	} catch (err) {
		console.error(err);
		return null;
	}

	return <MatchesMatchDto>response;
};
