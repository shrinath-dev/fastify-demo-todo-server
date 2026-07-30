import * as  bcrypt from 'bcrypt';

export default async function generateHash(password, salt) {

  if (!salt) {
    salt = await bcrypt.genSalt();
  }

  const hash = await bcrypt.hash(password, salt);

  return { hash, salt };
}
