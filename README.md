[![npm](https://img.shields.io/npm/v/color-ramp-cli)](https://www.npmjs.com/package/color-ramp-cli)

# 🎨 color-ramp-cli

_A simple CLI tool that generates color ramps from CSS colors._

## 📦 Installation

```bash
pnpm add -g color-ramp-cli
```

## 🛠 Options

| Option          | escription              | Default |
| --------------- | ----------------------- | ------- |
| --size <number> | Number of steps in ramp | 11      |
| -h, --help      | Show help message       |         |
| -v, --version   | Show version number     |         |

## Example

```bash
cgr "#ff5733"
npx color-ramp-cli red green blue
pnpm dlx color-ramp-cli skyblue "rgb(0 255 0)" "hsl(0 100% 25%)"
```

This will generate a smooth color ramp based on the input color.

## 📘 Help

Run with `--help` to see available commands and options:

```bash
cgr --help
```

## 📦 Output

A list of color values forming a ramp using OKLCH color space interpolation.

## 📝 License

MIT © [maxwihlborg](https://github.com/maxwihlborg)
