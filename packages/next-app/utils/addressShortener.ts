export const addressShortener = (address: string) => {
  if (address && address.length > 20) {
    return `${address.slice(0, 10)}...${address.slice(
      address.length - 10,
      address.length
    )}`;
  }
  return address;
};
