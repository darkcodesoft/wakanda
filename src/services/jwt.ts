import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '../keys/private.key'), 'utf8');
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '../keys/public.key'), 'utf8');

/**
 * JWTPayload interface
 */
export interface JWTPayload {
    _id: string,
    host: string
}

/**
 * singOptions config
 * @type jwt.SignOptions
 */
const singOptions: jwt.SignOptions = {
    issuer: 'DarkCode Software Inc.',
    subject: '',
    audience: 'wkd-admin',
    expiresIn: 60 * 60 * 12, // 12hr
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
    singOptions.subject = payload._id;
    singOptions.audience = payload.host;
    return jwt.sign(payload, PRIVATE_KEY, singOptions)
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
