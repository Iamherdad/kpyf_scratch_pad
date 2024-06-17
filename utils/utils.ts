export const clamp = (num: number, min: number, max: number) =>
  Math.max(Math.min(num, max), min);

export const xor8 = (data: number[]) => {
  let ck = 0;
  for (let i = 0; i < data.length; i++) {
    ck ^= data[i];
  }
  ck &= 0xff;
  return ck;
};

export const asyncSleep = (ms: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};
