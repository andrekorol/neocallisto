const sodium = require("libsodium-wrappers");

exports.getSeed = () => {
  return new Promise((resolve) => {
    const seed = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
    resolve(seed);
  });
};

exports.getHash = async (password, salt) => {
  return new Promise((resolve) => {
    const hash = sodium.crypto_pwhash(
      sodium.crypto_pwhash_BYTES_MIN,
      password,
      salt,
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_ALG_DEFAULT
    );
    resolve(hash);
  });
};
