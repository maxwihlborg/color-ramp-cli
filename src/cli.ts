#!/usr/bin/env node

import styles from "ansi-styles";
import { lerp, step } from "./lib.js";
import { cac } from "cac";
import {
  type ColorData,
  color as cssColor,
  serializeOKLCH,
  serializeRGB,
} from "@csstools/css-color-parser";
import { parseComponentValue } from "@csstools/css-parser-algorithms";
import { tokenize } from "@csstools/css-tokenizer";

function getRamp(o: ColorData | false, size: number): ColorData[] | null {
  if (!o) return null;

  const [l, c, h] = o.channels;
  const b = Math.round(l * size);

  const out: number[] = [];
  for (let i = 1; i < b; i++) {
    out.unshift(lerp(step(i, 1, b), 0, l));
  }
  for (let i = b; i <= size; i++) {
    out.unshift(lerp(step(i, b, size), l, 1));
  }

  return out.reduce<ColorData[]>((acc, l2) => {
    const out = cssColor(
      serializeRGB({
        ...o,
        channels: [l2, c, h],
      }),
    );
    if (out) {
      acc.push(out);
    }
    return acc;
  }, []);
}

const cli = cac("cgr");

cli
  .command("<...colors>")
  .option("--size <number>", "", { default: 11 })
  .action((colors, { size }) => {
    for (const color of colors) {
      const v = parseComponentValue(tokenize({ css: color }));
      const d = v && cssColor(v);
      if (d) {
        const o = serializeOKLCH(d);
        const ramp = getRamp(cssColor(o), size);
        for (const r of ramp ?? []) {
          const rgbAt = (n: number) => Math.round(lerp(r.channels[n], 0, 255));
          process.stdout.write(
            `${styles.bgColor.ansi16m(rgbAt(0), rgbAt(1), rgbAt(2))}  `,
          );
        }
        process.stdout.write(`${styles.bgColor.close}\n`);
      }
    }
  });

cli.help();
cli.version("0.0.0");

cli.parse();
