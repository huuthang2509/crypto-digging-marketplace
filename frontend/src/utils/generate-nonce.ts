export const generateRandomStringBS58 = (size?: number) => {
  const length = size ?? Math.floor(Math.random() * 20) + 5;

  let result = '';
  const characters = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
