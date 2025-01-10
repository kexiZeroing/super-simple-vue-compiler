import { parse } from 'vue/compiler-sfc';
import { join } from 'path';
import hashId from 'hash-sum';

import { resolveScript } from './script.js';
import { resolveStyles } from './style.js';
import { resolveTemplate } from './template.js';

const ID = '__demo__';
const ROOT = '@anonymous';
const FILENAME = 'anonymous.vue';
const COMP_ID = `__sfc__`;

export const resolveFeatures = (descriptor, context) => {
  const { filename, features, addedProps, id } = context;
  descriptor.styles.some((style) => {
    if (style.scoped) {
      features.hasScoped = true;
    }
    features.hasStyle = true;
    return features.hasScoped && features.hasStyle;
  });
  if (features.hasScoped) {
    addedProps.push(['__scopeId', JSON.stringify(`data-v-${id}`)]);
  }
  if (!context.isProd) {
    addedProps.push(['__file', JSON.stringify(filename.replace(/\\/g, '/'))]);
  }
};

const createContext = (source, options) => {
  const root = options?.root ?? ROOT;
  const filename = options?.filename ?? FILENAME;
  const fullpath = join(root, filename);
  const destFilename = `${options?.filename ?? FILENAME}.js`;
  const id = options?.filename ? hashId(options.filename + source) : ID;
  const context = {
    isProd: false,
    root,
    filename,
    fullpath,
    id,
    destFilename,
    options: options ?? {},
    features: {},
    addedProps: [],
    bindingMetadata: undefined,
  };
  return context;
};

const bundleTogether = (list) => {
  if (list.length === 1) {
    return list[0];
  }

  let code = '';
  list.forEach((block) => {
    code += `${block.code}\n`;
  });

  return { code };
};

export const compile = (source, options) => {
  const context = createContext(source, options);

  // get the code structure
  const { descriptor } = parse(source, {
    filename: context.filename,
    sourceMap: false,
  });

  // get the features
  resolveFeatures(descriptor, context);

  const { result: scriptResult } = resolveScript(
    descriptor,
    context
  );

  const { result: templateResult } = resolveTemplate(
    descriptor,
    context
  );

  const { files: cssFiles } = resolveStyles(
    descriptor,
    context
  );

  const jsCode = scriptResult.code;

  // assemble the final code
  const finalTransformedResult = bundleTogether([
    { code: jsCode },
    { code: templateResult.code },
    {
      code: context.addedProps
        .map(([key, value]) => `${COMP_ID}.${key} = ${value}`)
        .join('\n'),
    },
    { code: `export default ${COMP_ID}` },
  ]);

  return {
    js: {
      filename: context.destFilename,
      code: finalTransformedResult.code,
    },
    css: cssFiles,
  };
};