export type BasePath = {
  assetBase: string;
  basename: string;
};

export function resolveBasePath(value?: string): BasePath {
  const configuredPath = value?.trim() || '/';
  const withLeadingSlash = configuredPath.startsWith('/')
    ? configuredPath
    : `/${configuredPath}`;
  const withoutTrailingSlashes = withLeadingSlash.replace(/\/+$/, '');
  const normalizedPath = withoutTrailingSlashes || '/';
  const basePath = normalizedPath === '/' ? '/' : `${normalizedPath}/`;

  return {
    assetBase: basePath,
    basename: basePath,
  };
}
