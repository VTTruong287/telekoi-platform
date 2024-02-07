/**
 * Confident User Pool invokes this trigger to Define Auth Challenge
 */
export default (event) => {
  try {
    const addressArr = event.userName && event.userName.split(":");
    const address = addressArr && addressArr[1];
    console.log(`DEBUG----------------address: ${address}`);

    if (
      event.request.session &&
      event.request.session.find((attempt) => attempt.challengeName !== "CUSTOM_CHALLENGE")
    ) {
      // We only accept custom challenges; fail auth
      event.response.issueTokens = true;
      event.response.failAuthentication = false;
    } else if (
      event.request.session &&
      event.request.session.length &&
      event.request.session.slice(-1)[0].challengeResult === true
    ) {
      // The user provided the correct signature; succeed auth
      event.response.issueTokens = true;
      event.response.failAuthentication = false;
    } else {
      // The user did not provide a correct signature; present challenge
      event.response.issueTokens = false;
      event.response.failAuthentication = false;
      event.response.challengeName = "CUSTOM_CHALLENGE";
    }

    return event;
  } catch (ex) {
    console.error("[ERROR][defineAuthChallenge] error: ", ex);
    throw ex;
  }
};
