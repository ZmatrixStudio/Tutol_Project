import {device_id} from "./get-devices.js";
import {AES} from "./signature.js"

const keyBytes = new Uint8Array([
  0xdc,0x30,0xdd,0x97,0xe1,0xa6,0x13,0x94,
  0x1e,0x2f,0xf0,0x6b,0xa4,0xe8,0xf4,0x67,
  0xca,0x29,0x36,0xa8,0xd4,0xf1,0x12,0x12,
  0x3b,0x38,0xd1,0x67,0xf2,0x25,0x3f,0x63
]);  // x-token
async function getX_Token() {
    const time = Date.now();
    const deviceId = device_id(); // Xác minh thiết bị requests
    const raw = `${time}|${deviceId}`;
    const sign = await AES(`${raw}`, keyBytes);
    const xToken = `${sign.cipher}.${sign.nonce}`;
    return xToken;
}

export async function headers() {
    return {
        "Content-Type": "application/json",
        "X-Token": await getX_Token()
    };
}