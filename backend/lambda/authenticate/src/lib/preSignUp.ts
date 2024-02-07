/**
 * A federated user signs in from the Amazon Cognito hosted UI sign-in page for the first time.
 */
export default (event) => {
  try {
    // Confirm the user
    event.response.autoConfirmUser = true;

    // Set the email as verified if it is in the request
    if (event.request.userAttributes.hasOwnProperty('email')) {
      event.response.autoVerifyEmail = true;
    }

    // Set the phone number as verified if it is in the request
    if (event.request.userAttributes.hasOwnProperty('phone_number')) {
      event.response.autoVerifyPhone = true;
    }

    return event;
  } catch (ex) {
    console.error('[ERROR][preSignUp]', ex);
    throw ex;
  }
};
