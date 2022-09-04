import { Region } from "../../types/Region";
import { PlatformDataDto } from "../../types/VAL-STATUS-V1";
import fetchData from "../../utils/fetchData";

export const getStatusHandler = async ({
	region,
	apiKey,
}: {
	region: Region;
	apiKey: string;
}): Promise<PlatformDataDto | null> => {
	let response: any;

	try {
		response = await fetchData({
			region: region,
			endpoint: "/status/v1/platform-data",
			apiKey,
		});
	} catch (err) {
		console.error(err);
		return null;
	}

	return <PlatformDataDto>response;
};