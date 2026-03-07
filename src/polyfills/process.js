/** 07/03/2026 - CDMX|México
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
// Dummy process polyfill for browser environment
// ccapture.js and other modules may reference process but don't need full functionality

export const process = {
  env: {},
  cwd: () => '/',
  nextTick: (fn) => setTimeout(fn, 0),
  platform: 'browser',
  version: '',
  versions: {},
  arch: '',
  argv: [],
};

export default process;