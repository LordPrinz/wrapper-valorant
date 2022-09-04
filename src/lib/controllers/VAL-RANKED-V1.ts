import { int } from "../../types/alias";
import { Region } from "../../types/Region";
import { LeaderboardDto } from "../../types/VAL-RANKED-V1";
import fetchData from "../../utils/fetchData";

export const getRankedHandler = async (data: {
	actId: string;
	region: Region;
	apiKey: string;
	size?: int;
	startIndex?: int;
}): Promise<LeaderboardDto | null | never> => {
	const { actId, region, apiKey, size, startIndex } = data;

	if (size) {
		if (size < 1 || size > 200) {
			throw new Error("Invalid size. Valid values: 1 to 200");
		}
	}

	let response: any;

	try {
		response = await fetchData({
			region,
			endpoint: `/ranked/v1/leaderboards/by-act/${actId}`,
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