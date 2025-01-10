import { compile } from './compiler.js';
import {
  mvp,
  setup,
  scoped,
} from './fixture.js';

const result = compile(mvp, {
  filename: 'foo.vue',
});

// js.filename; // `foo.vue.js`
// js.code; // JavaScript code

// css[0].filename; // `foo.vue__0.css`
// css[0].code; // CSS code
console.log(result);
