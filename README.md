# Super Simple Vue Compiler

Learn from https://github.com/Jinjiang/vue-simple-compiler

This code is a rather simple version of Vue Single-File Component (SFC) compiler using pure JS. It doesn't support TypeScript, Sass/SCSS/Less, source map, or imported scripts/styles currently.

A more detailed understanding can be found https://vue-compiler.iamouyang.cn/template/baseCompile.html

A simple Vue SFC compile result:

```js
{
  js: {
    filename: 'foo.vue.js',
    code: '\n' +
      "import { ref } from 'vue'\n" +
      'const __sfc__ = {\n' +
      '  setup() {\n' +
      "    const msg = ref('Hello World!')\n" +
      '    return { msg }\n' +
      '  }\n' +
      '}\n' +
      '\n' +
      'import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, vModelText as _vModelText, withDirectives as _withDirectives, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"\n' +
      '\n' +
      'function render(_ctx, _cache, $props, $setup, $data, $options) {\n' +
      '  return (_openBlock(), _createElementBlock(_Fragment, null, [\n' +
      '    _createElementVNode("h1", null, _toDisplayString($setup.msg), 1 /* TEXT */),\n' +
      '    _withDirectives(_createElementVNode("input", {\n' +
      '      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (($setup.msg) = $event))\n' +
      '    }, null, 512 /* NEED_PATCH */), [\n' +
      '      [_vModelText, $setup.msg]\n' +
      '    ])\n' +
      '  ], 64 /* STABLE_FRAGMENT */))\n' +
      '}\n' +
      '__sfc__.render = render\n' +
      '__sfc__.__file = "foo.vue"\n' +
      'export default __sfc__\n'
  },
  css: [ { filename: 'foo.vue__0.css', code: '\n  h1 { color: red }\n' } ]
}
```
