export async function AES(input, keyBytes) {

    function bufToHex(buffer) {
        return [...new Uint8Array(buffer)]
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    }

    function hexToBytes(hex) {
        return new Uint8Array(hex.match(/.{1,2}/g).map(b => parseInt(b, 16)));
    }

    const data = new TextEncoder().encode(input);

    const nonce = crypto.getRandomValues(new Uint8Array(12));

    const key = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        "AES-GCM",
        false,
        ["encrypt", "decrypt"]
    );

    const ciphertext = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: nonce
        },
        key,
        data
    );

    return {
        nonce: bufToHex(nonce),   // key public
        cipher: bufToHex(ciphertext) // Data
    };
}


