type Data = {
  content?: string | null;
  file?: string | null;
};

export const hasContentOrFile = (data: Data) => {
  const hasContent = data.content && data.content.length > 0;
  const hasFile = data.file && data.file.length > 0;

  return hasContent || hasFile;
};
