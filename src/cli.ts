#!/usr/bin/env node

import {
  type ColorData,
  ColorNotation,
  color as cssColor,
  serializeOKLCH,
  serializeRGB,
} from "@csstools/css-color-parser";
import { parseComponentValue } from "@csstools/css-parser-algorithms";
import { tokenize } from "@csstools/css-tokenizer";
import styles from "ansi-styles";
import { cac } from "cac";
import { getErrorMessage, invariant, lerp, chain, pipe, step } from "./lib.js";

function toRGB({ channels, colorNotation }: ColorData) {
  invariant(colorNotation === ColorNotation.RGB);
  return {
    r: Math.round(lerp(channels[0], 0, 255)),
    g: Math.round(lerp(channels[1], 0, 255)),
    b: Math.round(lerp(channels[2], 0, 255)),
  };
}

function parseOKLCH(color: string) {
  return pipe(
    parseComponentValue(tokenize({ css: color })),
    chain(cssColor),
    chain(serializeOKLCH),
    chain(cssColor),
  );
}

function getRamp(input: ColorData, steps: number): ColorData[] {
  const [l, c, h] = input.channels;
  const base = Math.round(l * steps);

  const ls: number[] = [];
  for (let i = 1; i < base; i++) {
    ls.unshift(lerp(step(i, 1, base), 0, l));
  }
  for (let i = base; i <= steps; i++) {
    ls.unshift(lerp(step(i, base, steps), l, 1));
  }

  return ls.reduce<ColorData[]>((acc, l2) => {
    const data = cssColor(
      serializeRGB({
        ...input,
        channels: [l2, c, h],
      }),
    );
    if (data) {
      acc.push(data);
    }
    return acc;
  }, []);
}

const cli = cac("cgr");

cli
  .command("<...colors>", "list of CSS colors")
  .option("-s, --steps <number>", "amount of steps in the color ramp", {
    default: 11,
  })
  .example(`  $ ${cli.name} red green blue`)
  .example(
    `  $ ${cli.name} "hsl(1turn 100% 50%)" "color-mix(in srgb, blue, red 20%)"`,
  )
  .action((colors, { steps }) => {
    for (const color of colors) {
      const rampColors = pipe(
        parseOKLCH(color),
        chain((n) => getRamp(n, steps)),
      );
      if (!rampColors) continue;
      for (const data of rampColors) {
        const rgb = toRGB(data);
        process.stdout.write(
          `${styles.bgColor.ansi16m(rgb.r, rgb.g, rgb.b)}  `,
        );
      }
      process.stdout.write(`${styles.bgColor.close}\n`);
    }
  });

cli.help();
cli.version("1.2.0");

try {
  cli.parse(process.argv, { run: false });
  await cli.runMatchedCommand();
} catch (error) {
  console.error(getErrorMessage(error));
  process.exit(1);
}
