import { scrypt } from "scrypt-js";
import unorm from "unorm";

function scryptHash(password: string, salt: Uint8Array): Promise<Uint8Array> {
  return scrypt(new Buffer(unorm.nfkc(password)), salt, 1024, 8, 1, 64);
}

export default scryptHash;
