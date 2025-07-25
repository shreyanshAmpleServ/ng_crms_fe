import { SignJWT } from 'jose';

export const generateToken = async (payload) => {
  // Use environment variable or fallback to a default secret
  const secretKey = process.env.PUBLIC_SECRET || 'shreyansh.tripathi.crms';

  // Ensure the key is a Uint8Array
  const secret = new TextEncoder().encode(secretKey);

  // Create and return the signed JWT
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(secret);
};
