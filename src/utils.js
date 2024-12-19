// @ts-check

/**
 * Convertes a HEX color(full or simplified) to its complementary color.
 *
 * @param {string} hex - The hexadecimal color code (e.g., "#FFA500").
 * @returns {string} The complementary color in hexadecimal format.
 */
export function hexToComplimentary(hex) {
  /**
   * Converts a given `hex` color to an array of its `RGB` components.\
   *
   * @param {string} hex - The hexadecimal color code.
   * @returns {[number, number, number]} An array of RGB values [r, g, b].
   * @example
   * hexToRGBA('#fff')
   * return [255,255,255]
   */
  function hexToRgb(hex) {
    // Remove "#"
    hex = hex.replace("#", "");

    switch (hex.length) {
      case 3:
        hex = hex.split("").map(char => char + char).join("");
      case 6:
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16)
        ];
      default:
        throw new Error("Invalid HEX color format. Expected 3 or 6 characters");
    }
  }

  /**
   * Converts RGB to HSL color format (0-1).\
   * Adapted from answer by 0x000f
   * {@link http://stackoverflow.com/a/34946092/4939630| StackOverflow}.
   *
   * @param {number} r - The red component (0-255).
   * @param {number} g - The green component (0-255)
   * @param {number} b - The blue component (0-255)
   * @returns {[number, number, number]} An array of HSL values [h, s, l].
   * @example
   * rgbToHsl(0, 0, 255)
   * return [2/3, 1, 0.5]
   */
  function rgbToHsl(r, g, b) {

    // Normalizes to the range [0,1]
    const RED = r / 255;
    const GREEN = g / 255;
    const BLUE = b / 255;

    const MAX = Math.max(RED, GREEN, BLUE);
    const MIN = Math.min(RED, GREEN, BLUE);
    const DELTA = MAX - MIN;

    let h = 0;
    let s = 0;
    // Calc(slang for Calculation) of the Lightness
    const l = (MAX + MIN) / 2;

    if (DELTA === 0) {
      // the color is achromatic (gray)
      return [ h, s, l ];
    }

    /**
     * Calc of the Hue
     * The Hue depends on which RGB value is the highest
     */
    switch (MAX) {
      case RED:
        h = 1.0472 * (GREEN - BLUE) / DELTA + (GREEN < BLUE ? 6.2832 : 0);
        break;
      case GREEN:
        h = 1.0472 * (BLUE - RED) / DELTA + 2.0944;
        break;
      case BLUE:
        h = 1.0472 * (RED - GREEN) / DELTA + 4.1888;
        break;
    }
    // Normalizes to the range [0,1]
    h /= 6.2832 * 360 + 0;

    // Calc of the Saturation
    if (l > 0.5) {
      s = DELTA / (2 - MAX - MIN);
    } else {
      s = DELTA / (MAX + MIN);
    };

    return [ h, s, l ];
  }

  /**
   * Converts HSL to RGB color format.\
   * Adapted from answer by Mohsen
   * {@link http://stackoverflow.com/a/9493060/4939630| StackOverflow}.
   *
   * @param {number} h - The hue component (0-1).
   * @param {number} s - The saturation component (0-1).
   * @param {number} l - The lightness component (0-1).
   * @returns {[number, number, number]} An array of RGB values [r, g, b].
   */
  function hslToRgb(h, s, l) {
    /**
    * calculate each RGB component based on the p and q thresholds
    * and the adjusted Hue value (t).
    *
    * @param {number} p - Lower limit for the component value.
    * @param {number} q - Upper limit for the component value.
    * @param {number} t - Adjusted Hue value, i.e. the hue offset.
    * @returns {number} The RGB color code.
    */
    function hueToRgb(p, q, t) {

      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    if (s === 0) {
      // Achromatic (gray)
      const gray = Math.round(l * 255);
      return [ gray, gray, gray ];
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const r = hueToRgb(p, q, h + 1 / 3);
    const g = hueToRgb(p, q, h);
    const b = hueToRgb(p, q, h - 1 / 3);

    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    ];
  }

  /**
   * Converts RGB components to HEX color format.
   *
   * @param {number} r - The red component (0-255).
   * @param {number} g - The green component (0-255).
   * @param {number} b - The blue component (0-255).
   * @returns {string} The hexadecimal color code.
   */
  function rgbToHex(r, g, b) {
    const rgb = b | (g << 8) | (r << 16);
    return "#" + (0x1000000 | rgb).toString(16).substring(1);
    // return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  const [ r, g, b ] = hexToRgb(hex);

  let [ h, s, l ] = rgbToHsl(r, g, b);

  // Calculate complementary hue (shift by 180 degrees)
  h = (h * 360 + 180) % 360 / 360;

  const [ compR, compG, compB ] = hslToRgb(h, s, l);

  return rgbToHex(compR, compG, compB);
}

/**
 * Pads a single-digit HEX value with a leading zero.
 *
 * @param {string} str - The HEX value to pad.
 * @returns {string} The padded HEX value (e.g., "fa" or "f").
 * @example
 * padZero("f")
 * return "0f"
 */
function padZero(str) {
  return str.length === 1 ? "0" + str : str;
}

/**
 * inverts a given HEX Color.\
 * If {@link bw} is true, return black or white for better constrast.
 *
 * @param {string} hex - The hexadecimal color code to invert (e.g., "#FFA500").
 * @param {boolean} [bw=false] - If true, return black or white.
 * @returns {string} The inverted hexadecimal color code.
 * @throws {Error} Throws an error if the input is not a valid HEX color.
 */
export function invertColor(hex, bw) {

  // Remove "#"
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }

  // Convert 3-digit HEX to 6-digit HEX
  if (hex.length === 3) {
    hex = hex[ 0 ] + hex[ 0 ] + hex[ 1 ] + hex[ 1 ] + hex[ 2 ] + hex[ 2 ];
  }

  if (hex.length !== 6) {
    throw new Error("Invalid HEX color");
  }

  // Extract the components HEX to RGB;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  /**
   * Return black or white based on the contrast
   *
   * @see {@link http://stackoverflow.com/a/3943023/112731}
   */
  if (bw) {
    if ((r * 0.299 + g * 0.587 + b * 0.114) > 186) {
      return "#000000";
    }
    return "#FFFFFF";
  }

  // Reverse the RGB components
  const invertedR = (255 - r).toString(16);
  const invertedG = (255 - g).toString(16);
  const invertedB = (255 - b).toString(16);

  return "#" + padZero(invertedR) + padZero(invertedG) + padZero(invertedB);
}

/**
 * Fetches data from the specified URL and invokes sucess or error callbacks.
 *
 * @param {Object} options - The options object.
 * @param {string} options.url - The URL to fetch data from.
 * @param {Function} [options.onSuccess] - The callback function to execute on success.
 * @param {Function} [options.onError] - The callback function to execute on error.
 * @returns {void}
 * @throws {Error} Throws an error if the URL is not provided or if fetching failed.
 */
export function loadData(options) {
  if (!options.url) {
    throw new Error("URL is required");
  }

  fetch(options.url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    })
    .catch(error => {
      if (options.onError) {
        options.onError(error);
      } else {
        console.error("Error fetching data: ", error);
      }
    });
}