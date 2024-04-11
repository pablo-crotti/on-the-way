import { getToken } from "../utils/podbean";

import { cookies } from "next/headers";

export default async function Page() {
  const token = await getToken();
//   const theme = cookieStore.get("theme");


  // console.log(token)
  //
  // Cookies.set('token', token[0], { expires: 7 })

  return (
    <div>
      <h1 className="text-white">API Test</h1>
      <p className="text-white">This is a test of the API</p>
    </div>
  );
}
