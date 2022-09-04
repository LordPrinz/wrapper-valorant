import ValorantApi from "..";

const API_KEY = process.env.API_KEY || "xd";

test("No Api Key", async () => {
	expect(() => {
		return new ValorantApi("");
	}).toThrow("No api key provided!");
});
