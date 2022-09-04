import ValorantApi from "..";

const API_KEY = process.env.API_KEY || "xd";

test("No Api Key", async () => {
	expect(() => {
		return new ValorantApi("");
	}).toThrow("No api key provided!");
});

describe("VAL-CONTENT-V1", () => {
	test("getContent", async () => {
		const api = new ValorantApi(API_KEY);
		const result = await api.getContents({
			locale: "en-US",
			region: "na",
		});

		if (!result) {
			fail("No result.");
		}

		expect(result.characters).toBeTruthy();
		if (result.characters.length > 0) {
			expect(result.characters[0].assetName).toBeTruthy();
			expect(result.characters[0].name).toBeTruthy();
		}

		expect(result.charmLevels).toBeTruthy();
		if (result.charmLevels.length > 0) {
			expect(result.charmLevels[0].assetName).toBeTruthy();
			expect(result.charmLevels[0].name).toBeTruthy();
		}

		expect(result.charms).toBeTruthy();
		if (result.charms.length > 0) {
			expect(result.charms[0].assetName).toBeTruthy();
			expect(result.charms[0].name).toBeTruthy();
		}

		expect(result.chromas).toBeTruthy();
		if (result.chromas.length > 0) {
			expect(result.chromas[0].assetName).toBeTruthy();
			expect(result.chromas[0].name).toBeTruthy();
		}

		expect(result.equips).toBeTruthy();
		if (result.equips.length > 0) {
			expect(result.equips[0].assetName).toBeTruthy();
			expect(result.equips[0].name).toBeTruthy();
		}

		expect(result.gameModes).toBeTruthy();
		if (result.gameModes.length > 0) {
			expect(result.gameModes[0].assetName).toBeTruthy();
			expect(result.gameModes[0].name).toBeTruthy();
		}

		expect(result.maps).toBeTruthy();
		if (result.maps.length > 0) {
			expect(result.maps[0].assetName).toBeTruthy();
			expect(result.maps[0].name).toBeTruthy();
		}

		expect(result.playerCards).toBeTruthy();
		if (result.playerCards.length > 0) {
			expect(result.playerCards[0].assetName).toBeTruthy();
			expect(result.playerCards[0].name).toBeTruthy();
		}

		expect(result.playerTitles).toBeTruthy();
		if (result.playerTitles.length > 0) {
			expect(result.playerTitles[0].assetName).toBeTruthy();
			expect(result.playerTitles[0].name).toBeTruthy();
		}

		expect(result.skinLevels).toBeTruthy();
		if (result.skinLevels.length > 0) {
			expect(result.skinLevels[0].assetName).toBeTruthy();
			expect(result.skinLevels[0].name).toBeTruthy();
		}

		expect(result.skins).toBeTruthy();
		if (result.skins.length > 0) {
			expect(result.skins[0].assetName).toBeTruthy();
			expect(result.skins[0].name).toBeTruthy();
		}

		expect(result.sprayLevels).toBeTruthy();
		if (result.sprayLevels.length > 0) {
			expect(result.sprayLevels[0].assetName).toBeTruthy();
			expect(result.sprayLevels[0].name).toBeTruthy();
		}

		expect(result.sprays).toBeTruthy();
		if (result.sprays.length > 0) {
			expect(result.sprays[0].assetName).toBeTruthy();
			expect(result.sprays[0].name).toBeTruthy();
		}

		expect(result.version).toBeTruthy();

		expect(result.acts).toBeTruthy();
		if (result.acts.length > 0) {
			expect(result.acts[0].id).toBeTruthy();
			expect(result.acts[0].isActive).toBeDefined();
			expect(result.acts[0].name).toBeTruthy();
		}
	});
});

describe("VAL-STATUS-V1", () => {
	test("getPlatformData", async () => {
		const api = new ValorantApi(API_KEY);
		const result = await api.getStatus({
			region: "na",
		});
		expect(result).toBeTruthy();
	});
});

describe("VAL-RANKED-V1", () => {
	test("getLeaderboardsByAct", async () => {
		const api = new ValorantApi(API_KEY);
		const result = await api.getLeaderboard({
			actId: "67e373c7-48f7-b422-641b-079ace30b427",
			region: "na",
		});

		expect(result).toBeTruthy();
	});
});

describe("VAL-MATCH-V1", () => {
	test("getMatchById w/o Prod Key", async () => {
		const api = new ValorantApi(API_KEY);
		await api.match
			.getByMatchId({ matchId: "4761", region: "eu" })
			.catch((err: any) => {
				expect(err).toBeTruthy();
				expect(err.status_code).toBeTruthy();
				expect(err.status_code).not.toEqual(200);
				expect(err.message).toBeTruthy();
				expect(err.request).toBeTruthy();
			});
	});

	test("getMatchesByPuuid", async () => {
		const api = new ValorantApi(API_KEY);
		await api.match
			.getByPuuid({
				puuid: "00000000-0000-0000-0000-000000000000",
				region: "eu",
			})
			.catch((err: any) => {
				expect(err).toBeTruthy();
				expect(err.status_code).toBeTruthy();
				expect(err.status_code).not.toEqual(200);
				expect(err.message).toBeTruthy();
				expect(err.request).toBeTruthy();
			});
	});

	test("getRecentMatches", async () => {
		const api = new ValorantApi(API_KEY);
		await api.match
			.getByQueue({
				queue: "Competetive",
				region: "eu",
			})
			.catch((err: any) => {
				expect(err).toBeTruthy();
				expect(err.status_code).toBeTruthy();
				expect(err.status_code).not.toEqual(200);
				expect(err.message).toBeTruthy();
				expect(err.request).toBeTruthy();
			});
	});
});
