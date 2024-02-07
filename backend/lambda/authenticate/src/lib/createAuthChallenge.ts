/**
 * Confident User Pool invokes this trigger to create authen challange.
 */
export default (event) => {
  try {
    const addressArr = event.userName && event.userName.split(":");
    const address = addressArr && addressArr[1];
    console.log(`DEBUG----------------address: ${address}`);

    const { request = {} } = event;
    const { userNotFound } = request;
    if (userNotFound) {
      throw new Error("[404] User Not Found");
    }

    // We'll use a nonce here to make the message unique on each sign
    // in request to prevent replay attacks
    const nonce = Math.floor(Math.random() * 1000000).toString();
    const message = [
      "Welcome to Beatverse!",
      "This request will not trigger a blockchain transaction or cost any gas fees.",
      "Your authentication status will reset after 24 hours.",
      `Wallet address: ${address}`,
      `Nonce: ${nonce}`,
    ].join("\n\n");

    // This is sent back to the client app
    event.response.publicChallengeParameters = { message };

    // This is used later in our VerifyAuthChallenge trigger
    event.response.privateChallengeParameters = { message };

    return event;
  } catch (ex) {
    console.error("[ERROR][createAuthChallenge]", ex);
    throw ex;
  }
};
