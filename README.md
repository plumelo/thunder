# @plumelo/thunder

A tiny wrapper around [lightningcss](https://lightningcss.dev/) that adds a custom resolver and normalizes CSS module exports.

## Install

```sh
npm install @plumelo/thunder
```

## Usage

```ts
import thunder from "@plumelo/thunder";

const result = await thunder({
  filename: "src/styles.css",
  input: `
    .btn { color: red; }
    .btn--lg { font-size: 18px; }
  `,
});

// result.code       — compiled CSS (Buffer)
// result.map        — source map
// result.classes    — camelCased class name mapping
//   e.g. { btn: "btn", btnLg: "btn--lg" }
```

## Resolving imports

Thunder includes a custom resolver that handles `@import` resolution using [enhanced-resolve](https://github.com/webpack/enhanced-resolve):

```ts
import thunder, { resolver } from "@plumelo/thunder";

const result = await thunder({
  filename: "src/app.css",
  input: `@import "theme.css";`,
  resolver: resolver({
    extensions: [".css", ".scss"],
  }),
});
```

## API

### `thunder(options): Promise<ThunderResult>`

Wraps `lightningcss.bundleAsync` with:

- **Automatic targets** — defaults to `browserslist` targets if not specified
- **Custom resolver** — uses the built-in resolver by default
- **Normalized exports** — `result.classes` is a camelCased map of CSS module class names

### `resolver(options?)`

Returns a resolver object for `lightningcss`'s `resolver` option. Resolves `@import` specifiers by:

1. Treating the specifier as a relative path
2. Appending `.css` if the specifier has no extension
3. Falling back to `enhanced-resolve` (node_modules resolution)

## Exports

| Path | Description |
|---|---|
| `@plumelo/thunder` | Main API (`thunder` default export) |
| `@plumelo/thunder/resolve` | Resolver utility (`resolver` export) |

## License

[MIT](./LICENSE)