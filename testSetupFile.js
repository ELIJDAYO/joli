import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom/extend-expect';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
// Some of the `jest` tests are very slow and cause
// timeouts on bitbucket pipeline
console.log(`============ testSetupFile Loaded ===========`);
jest.setTimeout(70000);
