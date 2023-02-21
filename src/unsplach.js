import * as nodeFetch from "node-fetch";
import {createApi} from "unsplash-js";
import {getVarEnv} from "./getVarEnv.js";

let UNSPLASH_ACCESS_KEY = getVarEnv("UNSPLASH_ACCESS_KEY");

const unsplashApi = createApi({
  accessKey: UNSPLASH_ACCESS_KEY,
  fetch: nodeFetch.default,
});

export async function getRandomPhotos({
                                        count = 10,
                                        query = "",
                                        orientation = "landscape",
                                        defaultDescription = ""
                                      } = {}) {
  let res = await unsplashApi.photos.getRandom({count, query, orientation});
  if (res?.errors?.length) {
    throw new Error(`Unsplash Api Errors: ${res.errors.join()}`)
  }
  return res.response.map((p) => ({
    description: p.description ?? p.alt_description ?? defaultDescription,
    url: p.urls.regular,
  }));
}