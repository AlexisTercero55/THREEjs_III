/** 07/03/2026 - CDMX|México
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
// Dummy fs polyfill for browser environment
// ccapture.js imports fs but doesn't use it in browser context

export const readFileSync = () => null;
export const writeFileSync = () => null;
export const existsSync = () => false;
export const mkdirSync = () => null;
export const readdirSync = () => [];
export const statSync = () => null;

export default {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
};
