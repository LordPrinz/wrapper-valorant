import { Locale } from "../../types/LocalizedNamesDto";
import { Region } from "../../types/Region";
import { ContentDto } from "../../types/VAL-CONTENT-V1";
import fetchData from "../../utils/fetchData";

export const getContentsHandler = async (data: {
	locale: Locale;
	region: Region;
	apiKey: string;
}): Promise<ContentDto | null> => {
	const { locale, region, apiKey } = data;

	let response: any;

	try {
		response = await fetchData({
			region: region,
			endpoint: "/content/v1/contents",
			params: [`locale=${locale}`],
			apiKey,
		});
	} catch (err) {
		console.error(err);
		return null;
	}

	return <ContentDto>response;
};
