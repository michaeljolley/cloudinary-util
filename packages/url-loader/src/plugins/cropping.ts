import { PluginSettings, PluginOverrides } from '../types/plugins';

const cropsGravityAuto = [ 'crop', 'fill', 'lfill', 'fill_pad', 'thumb' ];
const cropsWithZoom = ['crop', 'thumb'];

export const props = [
  'crop',
  'gravity',
  'zoom'
];
export const assetTypes = ['image', 'images', 'video', 'videos'];

/**
 * normalizeNumberParameter
 * TODO: move into util
 */

export function normalizeNumberParameter(param: number | string | undefined) {
  if ( typeof param !== 'string' ) return param;
  return parseInt(param)
}

export function plugin(props: PluginSettings) {
  const { cldAsset, options } = props;

  const {
    width: defaultWidth,
    height: defaultHeight,
    widthResize: defaultWidthResize,
    // Default the crop to "limit" to avoid upscaling, even when widthResize is passed in.
    // This avoid further distorting the image since the browser will resize in that case.
    // If caller wants actual resize, can explicitly pass in "scale".
    crop = 'limit'
  } = options;

  const overrides: PluginOverrides = {
    width: undefined
  };

  // Normalize sizing parameters

  let height = normalizeNumberParameter(defaultHeight);
  let width = normalizeNumberParameter(defaultWidth);
  let widthResize = normalizeNumberParameter(defaultWidthResize);

  let transformationString = '';

  if ( width ) {
    transformationString = `c_${crop},w_${width}`;
  }

  // Gravity of auto only applies to certain crop types otherewise
  // errors, so default to auto only when crop matches type

  if ( !options.gravity && cropsGravityAuto.includes(crop) ) {
    options.gravity = 'auto';
  }

  // Some crop types don't need a height and will resize based
  // on the aspect ratio

  if ( !['limit'].includes(crop) ) {
    transformationString = `${transformationString},h_${height}`;
  }

  // If we have gravity, apply it, but check that the gravity passed
  // in doesn't conflict with the crop mode

  if ( options.gravity ) {
    if ( options.gravity === 'auto' && !cropsGravityAuto.includes(crop) ) {
      console.warn(`Auto gravity can only be used with crop modes: ${cropsGravityAuto.join(', ')}. Not applying gravity.`);
    } else {
      transformationString = `${transformationString},g_${options.gravity}`;
    }
  }

  // Some zoom types don't work with some crop types

  if ( options.zoom ) {
    if ( options.zoom === 'auto' && !cropsWithZoom.includes(crop) ) {
      console.warn(`Zoom can only be used with crop modes: ${cropsWithZoom.join(', ')}. Not applying zoom.`);
    } else {
      transformationString = `${transformationString},z_${options.zoom}`;
    }
  }

  // Finally apply the constructed transformation string to the image instance

  cldAsset.effect(transformationString);

  // If we have a resize width that's smaller than the user-defined width, we want to give the
  // ability to perform a final resize on the image without impacting any of the effects like text
  // overlays that may depend on the size to work properly

  if ( width && widthResize && widthResize < width ) {
    overrides.width = widthResize;
  }

  return {
    options: overrides
  }
}
