import { Cloudinary } from '@cloudinary/url-gen';

import * as fillBackgroundPlugin from '../../src/plugins/fill-background';

const { plugin } = fillBackgroundPlugin

const cld = new Cloudinary({
  cloud: {
    cloudName: 'test-cloud-name'
  }
});

const TEST_PUBLIC_ID = 'test-public-id';

describe('Plugins', () => {
  describe('Fill Background', () => {
    it('should generate a background with basic settings', () => {

      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        width: 800,
        height: 600,
        fillBackground: true
      }

      plugin({
        cldAsset: cldImage,
        options
      });

      expect(cldImage.toURL()).toContain(`b_gen_fill,ar_${options.width}:${options.height},w_${options.width},c_pad/${TEST_PUBLIC_ID}`);
    });

    it('should generate with custom options', () => {

      const cldImage = cld.image(TEST_PUBLIC_ID);

      const options = {
        width: 800,
        height: 600,
        fillBackground: {
          gravity: 'east',
          prompt: 'pink and purple flowers',
          crop: 'mpad'
        }
      }

      plugin({
        cldAsset: cldImage,
        options
      });

      expect(cldImage.toURL()).toContain(`b_gen_fill:${encodeURIComponent(options.fillBackground.prompt)},ar_${options.width}:${options.height},w_${options.width},c_${options.fillBackground.crop},g_${options.fillBackground.gravity}/${TEST_PUBLIC_ID}`);
    });
  });
});
