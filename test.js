import { compile } from './compiler.js';

const mvp = `
<script>
import { ref } from 'vue'
export default {
  setup() {
    const msg = ref('Hello World!')
    return { msg }
  }
}
</script>

<template>
  <h1>{{ msg }}</h1>
  <input v-model="msg">
</template>

<style scoped>
  h1 { color: red }
</style>
`;

const result = compile(mvp, {
  filename: 'foo.vue',
});

// js.filename; // `foo.vue.js`
// js.code; // JavaScript code

// css[0].filename; // `foo.vue__0.css`
// css[0].code; // CSS code
console.log(result);
