import { Denops } from "https://deno.land/x/denops_std@v6.4.2/mod.ts";
import { assert, is } from "https://deno.land/x/unknownutil@v3.17.3/mod.ts";
import Psd, { Group, Layer } from "npm:@webtoon/psd@0.4.0";

export function main(denops: Denops) {
  denops.dispatcher = {
    async textPsd(path: unknown): Promise<unknown> {
      assert(path, is.String);
      const data = await Deno.readFile(path);
      if (!isPsd(data)) {
        return [];
      }
      const psd = Psd.parse(data.buffer);
      const textPsd = makeTextPsd(psd);
      return textPsd;
    },
  };
}

function isPsd(data: Uint8Array): boolean {
  if (data.length < 4) {
    return false;
  }
  const signature = data.slice(0, 4);
  if (
    signature.toString() === (new TextEncoder().encode("8BPS")).toString()
  ) {
    return true;
  } else {
    return false;
  }
}

function makeTextPsd(psd: Psd): string[] {
  const ret: string[] = [];
  psd.children.forEach((child) => {
    if (child.type === "Layer") {
      ret.push(...makeTextLayer(child, 0));
    } else if (child.type === "Group") {
      ret.push(...makeTextGroup(child, 0));
    }
  });
  return ret;
}

function makeTextLayer(layer: Layer, depth: number): string[] {
  const ret: string[] = [];
  ret.push(" ".repeat(depth));

  const hidden = layer.isHidden ? " " : "x";
  ret.push(" ".repeat(depth) + `[${hidden}] ${layer.name}`);

  const opacitySlider = " ".repeat(depth) + " ".repeat(4) + "opacity: " +
    layer.opacity;
  ret.push(opacitySlider);
  return ret;
}

function makeTextGroup(group: Group, depth: number): string[] {
  const ret: string[] = [];
  ret.push(" ".repeat(depth));

  ret.push(" ".repeat(depth) + ` +  ${group.name}`);
  const opacitySlider = " ".repeat(depth) + " ".repeat(4) + "opacity: " +
    group.opacity;

  ret.push(opacitySlider);

  group.children.forEach((child) => {
    if (child.type === "Layer") {
      ret.push(...makeTextLayer(child, depth + 1));
    } else if (child.type === "Group") {
      ret.push(...makeTextGroup(child, depth + 1));
    }
  });
  return ret;
}
