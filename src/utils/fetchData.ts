import fetch from "node-fetch";

const fetchData = async <T>({
	region,
	endpoint,
	params,
	apiKey,
}: {
	region: string;
	endpoint: string;
	params: string[];
	apiKey: string;
}): Promise<T | never> => {
	if (!apiKey) {
		throw new Error("No API key provided!");
	}
	if (!endpoint) {
		throw new Error("No endpoint key provided!");
	}

	if (!region) {
		throw new Error("No region provided!");
	}

	const url = `https://${region}.api.riotgames.com/val${endpoint}?${params.join(
		"&"
	)}`;

	const response = await fetch(url, {
		headers: {
			"X-Riot-Token": apiKey,
		},
	}).then((response) => {
		if (response.status !== 200) {
			throw new Error(response.statusText);
		}
		return response.json();
	});

	return response;
};

export default fetchData;
