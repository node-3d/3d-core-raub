// Derived from https://evannorton.github.io/acerolas-epic-color-palettes/

const oklabToLinearSrgb = (L, a, b) => {
	let l_ = L + 0.3963377774 * a + 0.2158037573 * b;
	let m_ = L - 0.1055613458 * a - 0.0638541728 * b;
	let s_ = L - 0.0894841775 * a - 1.2914855480 * b;

	let l = l_ * l_ * l_;
	let m = m_ * m_ * m_;
	let s = s_ * s_ * s_;

	return [
		(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
		(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
		(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
	];
};

const oklchToOklab = (L, c, h) => {
	return [(L), (c * Math.cos(h)), (c * Math.sin(h))];
};

const lerp = (min, max, t) => {
	return min + (max - min) * t;
};


const generateOKLCH = (hueMode, settings) => {
	let oklchColors = [];

	let hueBase = settings.hueBase * 2 * Math.PI;
	let hueContrast = lerp(0.33, 1.0, settings.hueContrast);

	let chromaBase = lerp(0.01, 0.1, settings.saturationBase);
	let chromaContrast = lerp(0.075, 0.125 - chromaBase, settings.saturationContrast);
	let chromaFixed = lerp(0.01, 0.125, settings.fixed);

	let lightnessBase = lerp(0.3, 0.6, settings.luminanceBase);
	let lightnessContrast = lerp(0.3, 1.0 - lightnessBase, settings.luminanceContrast);
	let lightnessFixed = lerp(0.6, 0.9, settings.fixed);

	let chromaConstant = settings.saturationConstant;
	let lightnessConstant = !chromaConstant;

	if (hueMode === 'monochromatic') {
		chromaConstant = false;
		lightnessConstant = false;
	}

	for (let i = 0; i < settings.colorCount; ++i) {
		let linearIterator = (i) / (settings.colorCount - 1);

		let hueOffset = linearIterator * hueContrast * 2 * Math.PI + (Math.PI / 4);

		if (hueMode === 'monochromatic') hueOffset *= 0.0;
		if (hueMode === 'analagous') hueOffset *= 0.25;
		if (hueMode === 'complementary') hueOffset *= 0.33;
		if (hueMode === 'triadic') hueOffset *= 0.66;
		if (hueMode === 'tetradic') hueOffset *= 0.75;

		if (hueMode !== 'monochromatic')
			hueOffset += (Math.random() * 2 - 1) * 0.01;

		let chroma = chromaBase + linearIterator * chromaContrast;
		let lightness = lightnessBase + linearIterator * lightnessContrast;

		if (chromaConstant) chroma = chromaFixed;
		if (lightnessConstant) lightness = lightnessFixed;

		let lab = oklchToOklab(lightness, chroma, hueBase + hueOffset);
		let rgb = oklabToLinearSrgb(lab[0], lab[1], lab[2]);

		rgb[0] = Math.max(0.0, Math.min(rgb[0], 1.0));
		rgb[1] = Math.max(0.0, Math.min(rgb[1], 1.0));
		rgb[2] = Math.max(0.0, Math.min(rgb[2], 1.0));
		
		oklchColors.push(rgb);
	}

	return oklchColors;
};

const createSettings = (colorCount) => {
	return {
		hueBase: Math.random(),
		hueContrast: Math.random(),
		saturationBase: Math.random(),
		saturationContrast: Math.random(),
		luminanceBase: Math.random(),
		luminanceContrast: Math.random(),
		fixed: Math.random(),
		saturationConstant: true,
		colorCount: colorCount,
	};
};

const generatePalette = (hueMode, colorCount) => {
	let paletteSettings = createSettings(colorCount);
	let lch = generateOKLCH(hueMode, paletteSettings);
	console.log('New palette:', hueMode, lch);
	return lch;
};

const hueOffsets = {
	monochromatic: 0.0,
	analagous: 0.25,
	complementary: 0.33,
	triadic: 0.66,
	tetradic: 0.75,
};

const hueModes = Object.keys(hueOffsets);

module.exports = {
	hueModes,
	generatePalette,
};
