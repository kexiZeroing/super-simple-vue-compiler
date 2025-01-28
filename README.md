# Super Simple Vue Compiler

Learn from https://github.com/Jinjiang/vue-simple-compiler

This code is a rather simple version of Vue Single-File Component (SFC) compiler using pure JS. It doesn't support TypeScript, Sass/SCSS/Less, source map, or imported scripts/styles currently.

A more detailed understanding can be found https://vue-compiler.iamouyang.cn/template/baseCompile.html

## A simple Vue SFC compile result

```js
import { parse, compileScript, compileTemplate, rewriteDefault } from 'vue/compiler-sfc'

function compileSFC(source) {
  const { descriptor } = parse(source)
  const { script, template, styles } = descriptor
  
  let code = ''
  let cssCode = ''
  
  if (script) {
    const scriptBlock = compileScript(descriptor, {
      id: 'component'
    })
    
    const scriptCode = rewriteDefault(
      scriptBlock.content,
      '_sfc_main'
    )
    code += scriptCode + '\n'
  }
  
  if (template) {
    const templateResult = compileTemplate({
      source: template.content,
      id: 'component'
    })
    
    code += `\n${templateResult.code}\n`
    code += `_sfc_main.render = render\n`
  }
  
  if (styles.length) {
    cssCode = styles.map(style => {
      // You might want to process CSS with postcss or other tools here
      return style.content
    }).join('\n')
    
    code += `
      // Inject styles
      const style = document.createElement('style')
      style.textContent = ${JSON.stringify(cssCode)}
      document.head.appendChild(style)
    `
  }
  
  code += '\nexport default _sfc_main\n'
  
  return {
    js: code,
    css: cssCode
  }
}

// Example usage
const sfc = `
<template>
  <div class="greeting">{{ message }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue!'
    }
  }
}
</script>

<style>
.greeting {
  color: blue;
  font-size: 24px;
}
</style>
`

const result = compileSFC(sfc)
```

```js
{
  js: '\n' +
    'const _sfc_main = {\n' +
    '  data() {\n' +
    '    return {\n' +
    "      message: 'Hello Vue!'\n" +
    '    }\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    '\n' +
    'import { toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"\n' +
    '\n' +
    'const _hoisted_1 = { class: "greeting" }\n' +
    '\n' +
    'export function render(_ctx, _cache) {\n' +
    '  return (_openBlock(), _createElementBlock("div", _hoisted_1, _toDisplayString(_ctx.message), 1 /* TEXT */))\n' +
    '}\n' +
    '_sfc_main.render = render\n' +
    '\n' +
    '      // Inject styles\n' +
    "      const style = document.createElement('style')\n" +
    '      style.textContent = "\\n.greeting {\\n  color: blue;\\n  font-size: 24px;\\n}\\n"\n' +
    '      document.head.appendChild(style)\n' +
    '    \n' +
    'export default _sfc_main\n',
  css: '\n.greeting {\n  color: blue;\n  font-size: 24px;\n}\n'
}
```
