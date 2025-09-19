export function capitalize(str: string) {
  // each word's first letter to uppercase
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
