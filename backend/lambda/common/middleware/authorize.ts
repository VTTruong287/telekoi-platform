import { CognitoJwtVerifier } from 'aws-jwt-verify';

let cachedTokenVerifiers: { [name: string]: any } = {};

function getTokenVerifier(tokenUse: 'id' | 'access', opts: any): any {
  const { jwks, userPoolId, clientId } = opts;

  if (cachedTokenVerifiers[tokenUse]) {
    return cachedTokenVerifiers[tokenUse];
  }

  const verifier = CognitoJwtVerifier.create({
    tokenUse,
    userPoolId,
    clientId,
  });

  verifier.cacheJwks(jwks);

  cachedTokenVerifiers[tokenUse] = verifier;
  return verifier;
}

const verifyIdToken = (token: string, opts: any) => {
  const verifier = getTokenVerifier('id', opts);
  return verifier.verify(token);
};

const verifyAccessToken = (token: string, opts: any) => {
  const verifier = getTokenVerifier('access', opts);
  return verifier.verify(token);
};

async function verifyCognitoTokens(opts) {
  try {
    const { accessToken, idToken } = opts;

    const decodedAccessToken = verifyAccessToken(accessToken, opts);
    const decodedIdToken = verifyIdToken(idToken, opts);
    if (!decodedAccessToken || !decodedIdToken || !decodedIdToken['cognito:username']) {
      return {
        error: 'InvalidTokens',
      };
    }

    return decodedIdToken;
  } catch (ex) {
    const errMsg = ex.message || '';

    if (errMsg && errMsg.includes('Token expired')) {
      return {
        error: 'TokenExpired',
      };
    }

    return {
      error: 'CognitoValidateFailure',
    };
  }
}

export const apiAuthorizeMiddleware = async (req, res, next) => {
  const {
    STAGE,
    DISABLE_AUTHORIZATION,
    CUSTODIAL_COGNITO_USERS_POOL_ID,
    CUSTODIAL_COGNITO_CLIENT_ID,
    CUSTODIAL_COGNITO_JWKS,
    DECENTRALIZE_COGNITO_USERS_POOL_ID,
    DECENTRALIZE_COGNITO_CLIENT_ID,
    DECENTRALIZE_COGNITO_JWKS
  } = process.env;

  if (STAGE === 'dev' && DISABLE_AUTHORIZATION === 'enabled') {
    console.warn('AUTHORIZATION IS DISABLED!');
    req.auth = { id: req.get('x-fake-id') };
    next();
    return;
  }

  const userPoolType = req.get('x-user-pool');
  const acessToken = req.get('x-access-token');
  const idToken = req.get('x-id-token');

  try {
    let userPoolId, clientId, jwks;
    if (userPoolType === 'custodial') {
      userPoolId = CUSTODIAL_COGNITO_USERS_POOL_ID;
      clientId = CUSTODIAL_COGNITO_CLIENT_ID;
      jwks = JSON.parse(CUSTODIAL_COGNITO_JWKS);
    } else if (userPoolType === 'decentralize') {
      userPoolId = DECENTRALIZE_COGNITO_USERS_POOL_ID;
      clientId = DECENTRALIZE_COGNITO_CLIENT_ID;
      jwks = JSON.parse(DECENTRALIZE_COGNITO_JWKS);
    }

    const result = await verifyCognitoTokens({
      acessToken,
      idToken,
      userPoolId,
      clientId,
      jwks,
    });

    if (result.error) return res.status(401).json(result);

    req.auth = {
      username: result['cognito:username'],
    };
    return next();
  } catch (ex) {
    res.status(500).json({ error: 'InternalServerError' });
  }
};
