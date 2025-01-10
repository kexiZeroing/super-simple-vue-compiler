import { compileTemplate } from 'vue/compiler-sfc';

const COMP_ID = `__sfc__`;

export const resolveTemplate = (descriptor, context) => {
  if (descriptor.template && !descriptor.scriptSetup) {
    const templateResult = compileTemplate({
      ...context.options.sfcTemplateCompilerOptions,
      id: `data-v-${context.id}`,
      filename: context.filename,
      source: descriptor.template.content,
      scoped: context.features.hasScoped,
      compilerOptions: {
        bindingMetadata: context.bindingMetadata,
        ...context.options.sfcTemplateCompilerOptions?.compilerOptions,
      },
    });

    const templateCode = `${templateResult.code.replace(
      /\nexport (function|const) (render|ssrRender)/,
      `\n$1 render`
    )}\n${COMP_ID}.render = render`;

    return {
      result: {
        code: templateCode,
      },
    };
  }

  return { result: { code: '' } };
};