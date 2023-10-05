/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable max-len */

(async () => {
	const THREE = await import('three');
	const { init, addThreeHelpers } = require('../..');
	const {
		window,
		document,
		requestAnimationFrame,
		gl,
	} = init();
	addThreeHelpers(THREE, gl);
	
	const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js');
	const { ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass.js');
	const { BloomPass } = await import('three/examples/jsm/postprocessing/BloomPass.js');
	const { FilmPass } = await import('three/examples/jsm/postprocessing/FilmPass.js');
	const { DotScreenPass } = await import('three/examples/jsm/postprocessing/DotScreenPass.js');
	const { MaskPass, ClearMaskPass } = await import('three/examples/jsm/postprocessing/MaskPass.js');
	const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js');
	const { TexturePass } = await import('three/examples/jsm/postprocessing/TexturePass.js');
	const { BleachBypassShader } = await import('three/examples/jsm/shaders/BleachBypassShader.js');
	const { ColorifyShader } = await import('three/examples/jsm/shaders/ColorifyShader.js');
	const { HorizontalBlurShader } = await import('three/examples/jsm/shaders/HorizontalBlurShader.js');
	const { VerticalBlurShader } = await import('three/examples/jsm/shaders/VerticalBlurShader.js');
	const { SepiaShader } = await import('three/examples/jsm/shaders/SepiaShader.js');
	const { VignetteShader } = await import('three/examples/jsm/shaders/VignetteShader.js');
	// const { GammaCorrectionShader } = await import('three/examples/jsm/shaders/GammaCorrectionShader.js');
	const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
	
	let container;

	let composerScene, composer1, composer2, composer3, composer4;

	let cameraOrtho, cameraPerspective, sceneModel, sceneBG, renderer, mesh, directionalLight;

	const width = window.innerWidth || 2;
	const height = window.innerHeight || 2;

	let halfWidth = width / 2;
	let halfHeight = height / 2;

	let quadBG, quadMask, renderScene;

	const delta = 0.01;

	initExample();
	animate();

	function initExample() {

		container = document.getElementById( 'container' );

		//

		cameraOrtho = new THREE.OrthographicCamera( - halfWidth, halfWidth, halfHeight, - halfHeight, - 10000, 10000 );
		cameraOrtho.position.z = 100;

		cameraPerspective = new THREE.PerspectiveCamera( 50, width / height, 1, 10000 );
		cameraPerspective.position.z = 900;

		//

		sceneModel = new THREE.Scene();
		sceneBG = new THREE.Scene();

		//

		directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
		directionalLight.position.set( 0, - 0.1, 1 ).normalize();
		sceneModel.add( directionalLight );

		const loader = new GLTFLoader();
		loader.load( __dirname + '/models/LeePerrySmith.glb', function ( gltf ) {

			createMesh( gltf.scene.children[ 0 ].geometry, sceneModel, 100 );

		} );

		//

		const diffuseMap = new THREE.TextureLoader().load( __dirname + '/textures/pz.jpg' );
		// diffuseMap.colorSpace = THREE.SRGBColorSpace;

		const materialColor = new THREE.MeshBasicMaterial( {
			map: diffuseMap,
			depthTest: false
		} );

		quadBG = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), materialColor );
		quadBG.position.z = - 500;
		quadBG.scale.set( width, height, 1 );
		sceneBG.add( quadBG );

		//

		const sceneMask = new THREE.Scene();

		quadMask = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) );
		quadMask.position.z = - 300;
		quadMask.scale.set( width / 2, height / 2, 1 );
		sceneMask.add( quadMask );

		//

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( width, height );
		renderer.autoClear = false;

		//

		container.appendChild( renderer.domElement );

		//

		const shaderBleach = BleachBypassShader;
		const shaderSepia = SepiaShader;
		const shaderVignette = VignetteShader;

		const effectBleach = new ShaderPass( shaderBleach );
		const effectSepia = new ShaderPass( shaderSepia );
		const effectVignette = new ShaderPass( shaderVignette );
		// const gammaCorrection = new ShaderPass( GammaCorrectionShader );

		effectBleach.uniforms[ 'opacity' ].value = 0.95;

		effectSepia.uniforms[ 'amount' ].value = 0.9;

		effectVignette.uniforms[ 'offset' ].value = 0.95;
		effectVignette.uniforms[ 'darkness' ].value = 1.6;

		const effectBloom = new BloomPass( 0.5 );
		const effectFilm = new FilmPass( 0.35 );
		const effectFilmBW = new FilmPass( 0.35, true );
		const effectDotScreen = new DotScreenPass( new THREE.Vector2( 0, 0 ), 0.5, 0.8 );

		const effectHBlur = new ShaderPass( HorizontalBlurShader );
		const effectVBlur = new ShaderPass( VerticalBlurShader );
		effectHBlur.uniforms[ 'h' ].value = 2 / ( width / 2 );
		effectVBlur.uniforms[ 'v' ].value = 2 / ( height / 2 );

		const effectColorify1 = new ShaderPass( ColorifyShader );
		const effectColorify2 = new ShaderPass( ColorifyShader );
		effectColorify1.uniforms[ 'color' ] = new THREE.Uniform( new THREE.Color( 1, 0.8, 0.8 ) );
		effectColorify2.uniforms[ 'color' ] = new THREE.Uniform( new THREE.Color( 1, 0.75, 0.5 ) );

		const clearMask = new ClearMaskPass();
		const renderMask = new MaskPass( sceneModel, cameraPerspective );
		const renderMaskInverse = new MaskPass( sceneModel, cameraPerspective );

		renderMaskInverse.inverse = true;

		//

		const rtParameters = {
			stencilBuffer: true
		};

		const rtWidth = width / 2;
		const rtHeight = height / 2;

		//

		const renderBackground = new RenderPass( sceneBG, cameraOrtho );
		const renderModel = new RenderPass( sceneModel, cameraPerspective );

		renderModel.clear = false;

		composerScene = new EffectComposer( renderer, new THREE.WebGLRenderTarget( rtWidth * 2, rtHeight * 2, rtParameters ) );

		composerScene.addPass( renderBackground );
		composerScene.addPass( renderModel );
		composerScene.addPass( renderMaskInverse );
		composerScene.addPass( effectHBlur );
		composerScene.addPass( effectVBlur );
		composerScene.addPass( clearMask );

		//

		renderScene = new TexturePass( composerScene.renderTarget2.texture );

		//

		composer1 = new EffectComposer( renderer, new THREE.WebGLRenderTarget( rtWidth, rtHeight, rtParameters ) );

		composer1.addPass( renderScene );
		// composer1.addPass( gammaCorrection );
		composer1.addPass( effectFilmBW );
		composer1.addPass( effectVignette );

		//

		composer2 = new EffectComposer( renderer, new THREE.WebGLRenderTarget( rtWidth, rtHeight, rtParameters ) );

		composer2.addPass( renderScene );
		// composer2.addPass( gammaCorrection );
		composer2.addPass( effectDotScreen );
		composer2.addPass( renderMask );
		composer2.addPass( effectColorify1 );
		composer2.addPass( clearMask );
		composer2.addPass( renderMaskInverse );
		composer2.addPass( effectColorify2 );
		composer2.addPass( clearMask );
		composer2.addPass( effectVignette );

		//

		composer3 = new EffectComposer( renderer, new THREE.WebGLRenderTarget( rtWidth, rtHeight, rtParameters ) );

		composer3.addPass( renderScene );
		// composer3.addPass( gammaCorrection );
		composer3.addPass( effectSepia );
		composer3.addPass( effectFilm );
		composer3.addPass( effectVignette );

		//

		composer4 = new EffectComposer( renderer, new THREE.WebGLRenderTarget( rtWidth, rtHeight, rtParameters ) );

		composer4.addPass( renderScene );
		// composer4.addPass( gammaCorrection );
		composer4.addPass( effectBloom );
		composer4.addPass( effectFilm );
		composer4.addPass( effectBleach );
		composer4.addPass( effectVignette );

		renderScene.uniforms[ 'tDiffuse' ].value = composerScene.renderTarget2.texture;

		window.addEventListener( 'resize', onWindowResize );

	}

	function onWindowResize() {

		halfWidth = window.innerWidth / 2;
		halfHeight = window.innerHeight / 2;

		cameraPerspective.aspect = window.innerWidth / window.innerHeight;
		cameraPerspective.updateProjectionMatrix();

		cameraOrtho.left = - halfWidth;
		cameraOrtho.right = halfWidth;
		cameraOrtho.top = halfHeight;
		cameraOrtho.bottom = - halfHeight;

		cameraOrtho.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

		composerScene.setSize( halfWidth * 2, halfHeight * 2 );

		composer1.setSize( halfWidth, halfHeight );
		composer2.setSize( halfWidth, halfHeight );
		composer3.setSize( halfWidth, halfHeight );
		composer4.setSize( halfWidth, halfHeight );

		renderScene.uniforms[ 'tDiffuse' ].value = composerScene.renderTarget2.texture;

		quadBG.scale.set( window.innerWidth, window.innerHeight, 1 );
		quadMask.scale.set( window.innerWidth / 2, window.innerHeight / 2, 1 );

	}

	function createMesh( geometry, scene, scale ) {

		const diffuseMap = new THREE.TextureLoader().load( __dirname + '/textures/Map-COL.jpg' );
		// diffuseMap.colorSpace = THREE.SRGBColorSpace;

		const mat2 = new THREE.MeshPhongMaterial( {

			color: 0xcbcbcb,
			specular: 0x080808,
			shininess: 20,
			map: diffuseMap,
			normalMap: new THREE.TextureLoader().load( __dirname + '/textures/Infinite-Level_02_Tangent_SmoothUV.jpg' ),
			normalScale: new THREE.Vector2( 0.75, 0.75 )

		} );

		mesh = new THREE.Mesh( geometry, mat2 );
		mesh.position.set( 0, - 50, 0 );
		mesh.scale.set( scale, scale, scale );

		scene.add( mesh );

	}

	//

	function animate() {

		requestAnimationFrame( animate );
		render();

	}

	function render() {

		const time = Date.now() * 0.0004;

		if ( mesh ) mesh.rotation.y = - time;

		renderer.setViewport( 0, 0, halfWidth, halfHeight );
		composerScene.render( delta );

		renderer.setViewport( 0, 0, halfWidth, halfHeight );
		composer1.render( delta );

		renderer.setViewport( halfWidth, 0, halfWidth, halfHeight );
		composer2.render( delta );

		renderer.setViewport( 0, halfHeight, halfWidth, halfHeight );
		composer3.render( delta );

		renderer.setViewport( halfWidth, halfHeight, halfWidth, halfHeight );
		composer4.render( delta );

	}


})();