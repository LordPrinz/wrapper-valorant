import { int } from "../types/alias";
import { Region } from "../types/Region";
import { LeaderboardDto } from "../types/VAL-RANKED-V1";
import fetchData from "../utils/fetchData";

export const getRankedHandler = async ({
	actId,
	region = "eu",
	apiKey,
	size,
	startIndex,
}: {
	actId: string;
	region?: Region;
	apiKey: string;
	size?: int;
	startIndex?: int;
}): Promise<LeaderboardDto | null | never> => {
	if (size) {
		if (size < 1 || size > 200) {
			throw new Error("Invalid size. Valid values: 1 to 200");
		}
	}

	let response: any;

	try {
		response = await fetchData({
			region,
			endpoint: `/val/ranked/v1/leaderboards/by-act/${actId}`,
			apiKey,
			params: [
				`size=${size ? size : 200}`,
				`startIndex=${startIndex ? startIndex : 0}`,
			],
		});
	} catch (err) {
		console.error(err);
		return null;
	}

	return <LeaderboardDto>response;
};
