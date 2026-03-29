import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'lil-gui'
import { TorusGeometry, MeshPhongMaterial, DirectionalLight, OrthographicCamera, TextureLoader, Texture } from 'three';
import { RdPlane } from './RdPlane';
import { Circles } from '../circles/Circles';
import { ParamsRd } from '../data/ParamsRd';
import { RandomCircles } from '../circles/RandomCircles';


export class RdRttScene extends THREE.Object3D{


    private _scene		:THREE.Scene;
	private _camera		:THREE.PerspectiveCamera;
	private _quad		:RdPlane;
	private _renderer	:THREE.WebGLRenderer;

	private _buffer1	:THREE.WebGLRenderTarget;
	private _buffer2	:THREE.WebGLRenderTarget;
	
	private _pingpong	:boolean = true;
	private _circles	:Circles;
	private _circles2	:RandomCircles;

	private _plane      :THREE.Mesh;
	
	private mesh        :THREE.Mesh;
	private mesh2       :THREE.Mesh;
	private _rad        :number = 0;
    private _count      :number = 0;
	//private var mat2:RdColorMat2;

    constructor(){
        super();
    }

    public init(renderer:THREE.WebGLRenderer):void{
		
		this._renderer = renderer;
		
		let aspect:number = 1;
		
        this._camera = new THREE.PerspectiveCamera(40, aspect, 30, 3000);
		this._camera.position.z = 100;
		this._camera.lookAt( new THREE.Vector3() );
		
		this._scene  = new THREE.Scene();

		this._quad = new RdPlane();//new Mesh( cast new PlaneBufferGeometry( 2, 2 ), null );
		this._scene.add( this._quad );		
		
		let param = { 
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter, 
            format: THREE.RGBAFormat, 
            stencilBuffer: false 
        };

		let width:number = ParamsRd.width;
		let height:number = ParamsRd.height;
		
		this._buffer1 = new THREE.WebGLRenderTarget( width, height, param );		
		this._buffer2 = new THREE.WebGLRenderTarget( width, height, param );
		
		//rtt　の中に
        
        //let loader:TextureLoader = new TextureLoader();
		//let t:Texture = loader.load("./topimg/circle.png");
		///t.format = THREE.RGBAFormat;
		
		//this._circles = new Circles();
		//this._scene.add(this._circles);
		//this._circles.visible=false;

		this._circles2 = new RandomCircles();
		this._scene.add(this._circles2);



		//Params.gui.add(this._circles,"visible").listen();

		
		this.mesh = new THREE.Mesh(
			new THREE.PlaneGeometry(10,10), 
			new THREE.MeshBasicMaterial( { color:0xffffff, side:THREE.DoubleSide, transparent:true } )
		);
		

		//this._scene.add(this.mesh);
        /*
		this.mesh2 = new THREE.Mesh(
			new THREE.SphereGeometry(8),
			new THREE.MeshBasicMaterial( { color:0xffffff, side:THREE.DoubleSide, transparent:true } )
		);

		this._scene.add(this.mesh2);
		*/
		//this.mesh2.visible=false;
		//Dat.gui.add(mesh, "visible");
		
		//実体　非RTTテクスチャとしての出力
		//mat2 = new RdColorMat2(_buffer1, width, height);
		//_plane = new Mesh(cast new PlaneBufferGeometry(200, 200), mat2);
		//add(_plane);
		
	}
	
	
	
	public update():void{
		
		//this.mesh.visible = Math.random()<0.5 ? true : false;

		//this._circles.visible=false;
		//this._circles.update();
		this._circles2.update();

        this._count++;

        for(let i=0;i<20;i++){
            this._update();
        }
		
	}
	
	private _update():void{
		
        //console.log("UPDATE");

		if ( this._pingpong ){
			this._quad.update( this._buffer2 );
            this._renderer.setRenderTarget(this._buffer1);
			this._renderer.render(this._scene, this._camera);//, this._buffer1);
		}else{
			this._quad.update( this._buffer1 );
            this._renderer.setRenderTarget(this._buffer2);			
			this._renderer.render( this._scene, this._camera);//, this._buffer2);
		}
		
        this._renderer.setRenderTarget(null);
		this._pingpong = !this._pingpong;		
		
	}
	
	public getCurrentBuffer():THREE.WebGLRenderTarget{
		
		if (this._pingpong){
			return this._buffer1;
		}
		
		return this._buffer2;	
	}

}