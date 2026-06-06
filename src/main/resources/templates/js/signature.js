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

const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoFYJFvyRb6JOzlfllEyo
nAuLIprdYKmJvOLQm13UjGZX7xJvIYwvknHGCnZFWl+EApYlvnvLPbIiJzKfLLpw
uR68MyZwcrSM7zX6RLBEtnQmrYuoPB3BI6qIaYpGU/A0WD1ZysYK7qRouXVYQ7ow
rBopa/iefW9KtkST8uMlLCmOrZnV5rsqz5laGO8T+RA2+8n6OtV/cvMcib9HaRMt
qoFSwrA2RQOFiNZCs1XL1YYebcuZfeEZymBnGWx4kyt6DBV8WOto1My6PWdkQqvy
A3Y+WrQIj11axCFqQ3zXXX8D2EgLrT8BHV5//1Xe8TZrQscS3AFxsohxh/XbizMN
iQIDAQAB
-----END PUBLIC KEY-----`;

function pemToArrayBuffer(pem) {
  const b64 = pem
    .replace("-----BEGIN PUBLIC KEY-----", "")
    .replace("-----END PUBLIC KEY-----", "")
    .replace(/\s/g, "");

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
}

export async function RSA(data) {
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "spki",
    pemToArrayBuffer(publicKeyPem),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"]
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    key,
    encoder.encode(data)
  );

  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

// LIMIT LENGTH 190 

