import { ImageOptions } from "../types/image";
import { PluginSettings } from "../types/plugins";

export const props = ["replace"];
export const assetTypes = ["image", "images"];

export function plugin(props: PluginSettings<ImageOptions>) {
  const { cldAsset, options } = props;
  const { replace = null } = options;

  if (replace) {
    let from: string,
      to: string,
      preserveGeometry: boolean = false;

    if (Array.isArray(replace)) {
      from = replace[0] as string;
      to = replace[1] as string;
      preserveGeometry = (replace[2] as boolean) || false;
    } else {
      from = replace.from;
      to = replace.to;
      preserveGeometry = replace.preserveGeometry || false;
    }

    const properties = [`e_gen_replace:from_${from}`, `to_${to}`];

    // This property defaults to false, so we only need to pass it if it's true
    if (preserveGeometry) {
      properties.push(`preserve-geometry_${preserveGeometry}`);
    }

    cldAsset.effect(properties.join(";"));
  }

  return {};
}
