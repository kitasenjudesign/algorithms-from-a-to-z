import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'lil-gui'
import { TorusGeometry, MeshPhongMaterial, DirectionalLight, OrthographicCamera, TextureLoader } from 'three';
import rdVert from "../glsl/rd.vert";
import rdFrag from "../glsl/rd.frag";
import rdDecord from "../glsl/_encode-decode.frag";

import { ParamsRd } from '../data/ParamsRd';
import { p5MainRd } from '../myP5/p5MainRd';


export class RdShaderMat extends THREE.ShaderMaterial{


	private _texture	:THREE.Texture;
	private _countSpeed:number = 0.01;
	
	private _dA:number = 0;
	private _dB:number = 0;
	private _f:number = 0;
	private _k:number = 0;
	private _smoothing:boolean=false;

	public _p5	: p5MainRd;
	//private _fr:number = 0;
	//private _kr:number = 0;

	
	constructor() 
	{
		
		//let loader:TextureLoader = new TextureLoader();
		//var t:THREE.Texture = loader.load("./topimg/nuki.png");
		//t.format = THREE.RGBAFormat;
		
		super({
			vertexShader:   rdVert,
			fragmentShader: rdDecord+rdFrag,
			uniforms: {
				tex1: { value: null },
				tex2: { value: null },
				ruleTex: { value: null },
				size: { value: new THREE.Vector2(ParamsRd.width, ParamsRd.height) },
				count: { value: 0 },
				dA: { value: 1.0 },
				dB: { value: 0.37 },
				f: { value: 0.0545 },
				k: { value: 0.062 },
				offsetF: { value: 0.0 },
				offsetK: { value: 0.0 },
				noiseDetail: { value: 1 },
				/*
		this._f = 0.076;
		this._k = 0.065;
		this._dA = 1.0;
		this._dB = 0.15;				*/

				//パラメータを渡している！！
				params: {value: ParamsRd.rdParams}
			}			
		});
        this.side=THREE.DoubleSide;
		
		this._p5 = new p5MainRd();
		this._p5.init(()=>{

		});

		let gui = ParamsRd.gui;
		gui.add(this.uniforms.dA, "value", 0, 1.5).name("dA").listen();
		gui.add(this.uniforms.dB, "value",0,1.5).name("dB").listen();
		gui.add(this.uniforms.f,  "value", 0, 0.2).name("f").listen();
		gui.add(this.uniforms.k,  "value", 0, 0.2).name("k").listen();
		
		gui.add(this.uniforms.offsetF, "value", 0, 0.5).name("of").listen();
		gui.add(this.uniforms.offsetK, "value", 0, 0.5).name("ok").listen();
		
		gui.add(this.uniforms.noiseDetail, "value", 0, 5).name("noiseDetail").listen();
		gui.add(this, "_countSpeed", 0, 1).name("countSpeed").listen();
		
		gui.add(this.uniforms.size.value,"x",0,2048).listen();
		gui.add(this.uniforms.size.value,"y",0,2048).listen();
		
		let g = gui.addFolder("setParam");
		/*
		gui.add(this, "_setParam1");
		gui.add(this, "_setParam2");
		gui.add(this, "_setParam3");
		gui.add(this, "_setParam4");	
		gui.add(this, "_setParam5");	
		gui.add(this, "_setParam6");			
		gui.add(this, "_setParam7");			
		gui.add(this, "_setParam8");	
		gui.add(this, "_setParam9");
		gui.add(this, "_setParamA");
		gui.add(this, "_setParamB");
		gui.add(this, "_setParamC");
		gui.add(this, "_setParamD");
		gui.add(this, "_setParamE");
		gui.add(this, "_setParamF");
		gui.add(this, "_setParamG");
		gui.add(this, "_setParamH");*/
		gui.add(this, "_smoothing").listen();

		gui.add(this, "_setRandom");		
		
		
		this.fog = false;
		this._setParam9();
	}
	
	private _setRandom():void{
		
		this.uniforms.dA.value = Math.random() * 0.5;
		this.uniforms.dB.value = Math.random() * 0.5;
		this.uniforms.f.value = Math.random() * 0.1;
		this.uniforms.k.value = Math.random() * 0.1;
		

		//this.uniforms.offsetF.value = (Math.random()-0.5) * 0.01;
		//this.uniforms.offsetK.value = (Math.random()-0.5) * 0.01;
	}

	private _setParam1():void{
		this._f = 0.015;
		this._k = 0.049;
		this._dA = 0.21;//21,105
		this._dB = 0.105;
		this._update();
	}
	private _setParam2():void{
		this._f = 0.018;
		this._k = 0.0476;
		this._dA = 0.21;
		this._dB = 0.105;
		this._update();
	}
	private _setParam3():void{
		this._f = 0.1214;//0.063;
		this._k = 0.1114;//0.105;
		this._dA = 1.15;//0.058;
		this._dB = 1.35;//0.210;
		this._update();
	}	
	private _setParam4():void{
		this._f = 0.0053;
		this._k = 0.038;
		this._dA = 0.586;
		this._dB = 0.178;
		this._update();
	}	
	private _setParam5():void{
		this._f = 0.076;
		this._k = 0.065;
		this._dA = 1.0;
		this._dB = 0.15;
		this._update();
	}		
	private _setParam6():void{
		this._f = 0.028;
		this._k = 0.05;
		this._dA = 1.0;
		this._dB = 0.15;
		this._update();
	}			
	private _setParam7():void{
		this._dA = 1.0;
		this._dB = 0.15;
		this._f = 0.0367;
		this._k = 0.0649;
		this._update();
	}
	private _setParam8():void{
		this._f = 0.037;
		this._k = 0.059;
		this._dA = 0.597;
		this._dB = 0.342;
		this._update();
	}
	private _setParam9():void{
		this._f = 0.037;
		this._k = 0.059;
		this._dA = 0.5;
		this._dB = 0.342;
		this._update();
	}	
	private _setParamA():void{
		this._f = 0.00931;
		this._k = 0.03482;
		this._dA = 0.108;
		this._dB = 0.322;
		this._update();
	}	
	private _setParamB():void{
		this._dA = 0.9465;
		this._dB = 0.339;
		this._f = 0.109;
		this._k = 0.0574;
		this._update();
	}	
	private _setParamC():void{
		this._f = 0.1262;
		this._k = 0.0574;
		this._dA = 0.9465;
		this._dB = 0.246;
		this._update();
	}	
	private _setParamD():void{
		this._f = 0.018;
		this._k = 0.0476;
		this._dA = 0.615;
		this._dB = 0.228;
		this._update();
	}	
	private _setParamE():void{
		this._f = 0.1336;
		this._k = 0.0598;
		this._dA = 1;
		this._dB = 0.246;
		this._update();
	}
	private _setParamF():void{
		this._f = 0.1262;
		this._k = 0.05;
		this._dA = 0.9465;
		this._dB = 0.246;
		this._update();
	}
	private _setParamG():void{
		this._f = 0.114;
		this._k = 0.0598;
		this._dA = 1;
		this._dB = 0.15;
		this._update();
	}	

	private _setParamH():void{
		this._f = 0.0328;
		this._k = 0.059;
		this._dA = 0.5;
		this._dB = 0.342;
		this._update();
	}	


	private _update(){

		if(!this._smoothing){
			this.uniforms.dA.value= this._dA;// - this.uniforms.dA.value) / 90;
			this.uniforms.dB.value= this._dB;// - this.uniforms.dB.value) / 90;
	
			this.uniforms.f.value= this._f;// - this.uniforms.f.value) / 90;
			this.uniforms.k.value= this._k;// - this.uniforms.k.value) / 90;			
		}

	}

	/**
	 * update
	 * @param	a
	 * @param	vi
	 */
	public update(buffer:THREE.WebGLRenderTarget):void {
		//this._f = 0.037+0.001*Math.random();

		if(this._smoothing){
			this.uniforms.dA.value+= (this._dA - this.uniforms.dA.value) / 400;
			this.uniforms.dB.value+= (this._dB - this.uniforms.dB.value) / 400;
	
			this.uniforms.f.value+= (this._f - this.uniforms.f.value) / 400;
			this.uniforms.k.value+= (this._k - this.uniforms.k.value) / 400;			
		}
		
		this.uniforms.tex1.value = buffer.texture;
		this.uniforms.count.value += this._countSpeed;
		if(this._p5.getCanvasTex()!=null){

			this.uniforms.ruleTex.value = this._p5.getCanvasTex();

		}

	}

}