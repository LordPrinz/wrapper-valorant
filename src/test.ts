import ValorantApi from ".";
import { LocalizedNamesDto } from "./types/LocalizedNamesDto";

const api = new ValorantApi("RGAPI-9995678d-81d0-44e9-9d54-061fe2f0b9e8");

console.log(api.getContent());
