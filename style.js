const getCssPath = (srcPath, index, lang) => `${srcPath}__${index}.${lang}`;

export const resolveStyles = (descriptor, context) => {
  const cssFileList = [];
  descriptor.styles.every((style, index) => {
    const scopedId = context.id.toString();
    const lang = 'css';
    // e.g. `./filename.vue__0.css` (only for non-src styles)
    const cssFilePath = getCssPath(context.filename, index, lang);

    if (!style.src) {
      const cssFile = {
        filename: cssFilePath,
        code: style.content,
      };
      if (style.scoped) {
        cssFile.scoped = scopedId;
      }
      cssFileList.push(cssFile);
    }

    return true;
  });

  return {
    files: cssFileList,
  };
};