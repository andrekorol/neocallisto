const _sodium = require("libsodium-wrappers");

exports.getSeed = async () => {
  await _sodium.ready;
  const sodium = _sodium;
  const seed = await sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);

  return seed;
};

exports.getHash = async (password, salt) => {
  await _sodium.ready;
  const sodium = _sodium;
  const hash = await sodium.crypto_pwhash(
    sodium.crypto_pwhash_BYTES_MIN,
    password,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_DEFAULT
  );

  return hash;
};
