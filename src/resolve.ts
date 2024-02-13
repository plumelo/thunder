import enhancedResolve, { ResolveOptionsOptionalFS } from "enhanced-resolve";
import path from "path";
import fs from "fs/promises";

const mkResolveCss = (options?: ResolveOptionsOptionalFS) => {
  const resolver = enhancedResolve.create({
    ...options,
    extensions: options?.extensions ?? [".css"],
  });
  return (specifier: string, from: string) =>
    new Promise<string>((resolve, reject) =>
      resolver(from, specifier, (err, resolved) => {
        if (err || !resolved)
          return reject(`Failed to resolve import: ${from} ${err}`);
        return resolve(resolved);
      }),
    );
};

const relative = async (specifier: string, from: string) => {
  const rel = path.resolve(path.dirname(from), specifier);
  await fs.lstat(rel);
  return rel;
};

export const mkResolve = (options?: ResolveOptionsOptionalFS) => {
  const resolveCss = mkResolveCss(options);
  return (specifier: string, from: string) =>
    relative(specifier, from)
      .catch(() => relative(`${specifier}.css`, from))
      .catch(() => resolveCss(specifier, from));
};

export const resolver = (options?: ResolveOptionsOptionalFS) => ({
  resolve: mkResolve(options),
});
