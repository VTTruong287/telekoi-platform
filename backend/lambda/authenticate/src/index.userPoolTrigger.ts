import defineAuth from "./lib/defineAuthChallenge";
import createAuthen from "./lib/createAuthChallenge";
import verifyAuthen from "./lib/verifyAuthChallenge";
import preSignUp from "./lib/preSignUp";

enum TRIGGER_SOURCE {
  DEFINE_AUTH_CHALLENGE = "DefineAuthChallenge_Authentication",
  CREATE_AUTH_CHALLENGE = "CreateAuthChallenge_Authentication",
  VERIFY_AUTH_CHALLENGE = "VerifyAuthChallengeResponse_Authentication",
  PRE_SIGN_UP = "PreSignUp_SignUp",
}

export const handler = async (event, context, callback) => {
  console.log(`DEBUG-----------------gaia-decentralize-trigger event: ${JSON.stringify(event)}`);
  switch (event.triggerSource) {
    case TRIGGER_SOURCE.DEFINE_AUTH_CHALLENGE:
      defineAuth(event);
      break;
    case TRIGGER_SOURCE.CREATE_AUTH_CHALLENGE:
      createAuthen(event);
      break;
    case TRIGGER_SOURCE.VERIFY_AUTH_CHALLENGE:
      verifyAuthen(event);
      break;
    case TRIGGER_SOURCE.PRE_SIGN_UP:
      preSignUp(event);
      break;
  }

  callback(null, event);
};
