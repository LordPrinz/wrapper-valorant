import axios from "axios";

const fetchData = async <T>({
	region,
	endpoint,
	params,
	apiKey,
}: {
	region: string;
	endpoint: string;
	params?: string[];
	apiKey: string;
}): Promise<T | never> => {
	if (!endpoint) {
		throw new Error("No endpoint key provided!");
	}

	if (!region) {
		throw new Error("No region provided!");
	}

	const url = `https://${region}.api.riotgames.com${endpoint}?${
		params ? params.join("&") : ""
	}`;

	try {
		const { data } = await axios(url, {
			headers: {
				"X-Riot-Token": apiKey,
			},
		});

		return data;
	} catch (err) {
		return err as never;
	}
};

export default fetchData;
