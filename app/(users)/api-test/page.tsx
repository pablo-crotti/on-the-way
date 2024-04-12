// import { fetchPodcasts } from "../utils/podbean";
import { fetchPodcasts } from "../actions";

import { cookies } from "next/headers";

export default async function Page() {

  const podcasts = fetchPodcasts();

  return (
    <div>
      <h1 className="text-white">API Test</h1>
      <p className="text-white">This is a test of the API</p>
    </div>
  );
}
