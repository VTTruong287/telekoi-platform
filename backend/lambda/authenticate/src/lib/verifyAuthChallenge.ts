import { fromRpcSig, ecrecover, pubToAddress } from "ethereumjs-util";
import sha3 from "../utils/sha3";

/**
 * Confident User Pool invokes this trigger to Verify Auth Challenge Response.
 */
export default (event) => {
  try {
    const addressArr = event.userName && event.userName.split(":");
    const address = addressArr && addressArr[1];
    console.log(`DEBUG----------------address: ${address}`);

    //This is the signature response from our Web3 app
    const signature = event.request.challengeAnswer;
    //Our usernames are the same as our public addresses

    const { v, r, s } = fromRpcSig(signature);

    //Now for SOME REASON metamask prepends a few parameters
    const messageHash = sha3(
      "\u0019Ethereum Signed Message:\n" +
        event.request.privateChallengeParameters.message.length.toString() +
        event.request.privateChallengeParameters.message
    );
    const messageBuffer = Buffer.from(messageHash.replace("0x", ""), "hex");
    const recoveredPublicKey = ecrecover(messageBuffer, v, r, s);
    const recoveredAddress = `0x${pubToAddress(recoveredPublicKey).toString("hex")}`;

    if (address.toLowerCase() === recoveredAddress.toLowerCase()) {
      event.response.answerCorrect = true;
    } else {
      event.response.answerCorrect = false;
    }
    return event;
  } catch (ex) {
    console.error("[ERROR][verifyAuthChallenge]", ex);
    throw ex;
  }
};
