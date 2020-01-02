import fs from 'fs';
import { join } from 'path';
import jwt from 'jsonwebtoken';

const PRIVATE_KEY = fs.readFileSync(join(process.cwd(), 'src/keys/private.key'), 'utf8');
const PUBLIC_KEY = fs.readFileSync(join(process.cwd(), 'src/keys/public.key'), 'utf8');

/**
 * JWTPayload interface
 */
export interface JWTPayload {
    _id: string,
    name: string,
    email: string,
    host: string
}

/**
 * signatureOptions config
 * @type jwt.SignOptions
 */
const signatureOptions: jwt.SignOptions = {
    issuer: 'DarkCode Software Inc.',
    subject: '',
    audience: 'wkd-admin',
    expiresIn: 60 * 60, // 60 * 60 * 12 --> 12hr
    algorithm: "RS256"
}

/**
 * verifyOptions config
 * @type jwt.VerifyOptions
 */
const verifyOptions: jwt.VerifyOptions = {
    issuer: 'DarkCode Software Inc.',
    subject: '',
    audience: 'wkd-admin'
}

/**
 *
 * @param payload
 * @return jwt.sign method
 */
export function JWTSign(payload: JWTPayload) {
    signatureOptions.subject = payload._id;
    signatureOptions.audience = payload.host;
    return jwt.sign(payload, PRIVATE_KEY, signatureOptions)
}

/**
 *
 * @param token
 * @param email
 * @return bool
 */
export function JWTVerify(token: string, id: string, host: string) {
    verifyOptions.subject = id;
    verifyOptions.audience = host;

    try {
        return jwt.verify(token, PUBLIC_KEY, verifyOptions);
    } catch (err){
        return false;
    }
}

/**
 *
 * @param token
 */
export function JWTDecode(token: string) {
    return jwt.decode(token, { complete: true });
}
