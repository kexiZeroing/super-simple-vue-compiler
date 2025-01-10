import { compileScript, rewriteDefault } from 'vue/compiler-sfc';

const COMP_ID = `__sfc__`;

export const resolveScript = (descriptor, context) => {
  if (descriptor.script || descriptor.scriptSetup) {
    let scriptBlock;

    scriptBlock = compileScript(descriptor, {
      ...context.options.sfcScriptCompilerOptions,
      id: context.id,
      inlineTemplate: true,
      templateOptions: {
        ...context.options.sfcScriptCompilerOptions?.templateOptions,
        compilerOptions: {
          ...context.options.sfcScriptCompilerOptions?.templateOptions?.compilerOptions,
        },
      },
      isProd: context.isProd,
    });

    context.bindingMetadata = scriptBlock.bindings;

    return {
      result: {
        code: rewriteDefault(scriptBlock.content, COMP_ID),
      },
    };
  } else {
    return { result: { code: `const ${COMP_ID} = {}` } };
  }
};