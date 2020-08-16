const sodium = require("libsodium-wrappers");

exports.getSeed = () => {
  return new Promise((resolve) => {
    const seed = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
    resolve(seed);
  });
};

exports.getPsswdHash = async (password, salt) => {
  return new Promise((resolve) => {
    const hash = sodium.crypto_pwhash(
      sodium.crypto_pwhash_BYTES_MIN,
      password,
      salt,
      1,
      33554432, // 32 MB
      sodium.crypto_pwhash_ALG_DEFAULT
    );
    resolve(hash);
  });
};

exports.genericHash = (message) => {
  return new Promise((resolve) => {
    const genericHash = sodium.crypto_generichash(
      sodium.crypto_generichash_BYTES_MIN,
      message,
      process.env.GENERICHASH_KEY
    );
    resolve(genericHash);
  });
};
