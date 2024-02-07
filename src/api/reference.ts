export class ReferenceService {
  constructor() {}

  public async saveRefCode(id: string, refId: string) {
    // TODO: ...
    // Verify exist id & RefId
    // Can do at FE or Lambda ...
    const res = await fetch(`https://7b3maiy6a4.execute-api.ap-southeast-1.amazonaws.com/reference`, {
      method: "PUT", // *GET, POST, PUT, DELETE, etc.
      // mode: "cors", // no-cors, *cors, same-origin
      // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        "Access-Control-Allow-Origin": "*"
      },
      // redirect: "follow", // manual, *follow, error
      // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({id, refId }), // body data type must match "Content-Type" header
    });
    const data = await res.json();
    return data;
  }
  
  public async getAllReference() {
    console.log('CALL --- getAllReference')
    const res = await fetch(`https://7b3maiy6a4.execute-api.ap-southeast-1.amazonaws.com/reference`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      // mode: "cors", // no-cors, *cors, same-origin
      // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        "Access-Control-Allow-Origin": "*"
      },
      // redirect: "follow", // manual, *follow, error
      // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      // body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    const data = await res.json();
    return data;
  }
}
