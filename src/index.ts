import browserslist from "browserslist";
import {
  bundleAsync,
  browserslistToTargets,
  CustomAtRules,
  BundleAsyncOptions,
  TransformResult,
} from "lightningcss";

import { resolver } from "./resolve";

const defaultResolver = resolver();

const dashesCamelCase = (str: string) =>
  str.replace(/-+(\w)/g, (_, firstLetter) => firstLetter.toUpperCase());

const normalizeOptions = <C extends CustomAtRules>(
  options: BundleAsyncOptions<C>,
) => ({
  ...options,
  targets: options.targets ?? browserslistToTargets(browserslist()),
  resolver: options.resolver ?? defaultResolver,
});

export interface ThunderResult extends TransformResult {
  classes?: Record<string, string>;
}
const normalizeResult = (res: TransformResult): ThunderResult => {
  if (res.exports) {
    return {
      ...res,
      classes: Object.fromEntries(
        Object.entries(res.exports).map(([key, exp]) => [
          dashesCamelCase(key),
          [exp.name, ...exp.composes.map(({ name }) => name)].join(" "),
        ]),
      ),
    };
  }
  return res;
};

const thunder = async <C extends CustomAtRules>(
  options: BundleAsyncOptions<C>,
): Promise<ThunderResult> =>
  normalizeResult(
    await bundleAsync(normalizeOptions(options)).catch((e) =>
      Promise.reject(
        new Error(
          `Failed to bundle css. ${e.data} ${e.fileName} ${e.loc.line}:${e.loc.column}`,
        ),
      ),
    ),
  );

export default thunder;
