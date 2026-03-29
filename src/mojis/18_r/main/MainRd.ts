import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'lil-gui'
import { TorusGeometry, MeshPhongMaterial, DirectionalLight, OrthographicCamera, Vector3, BoxGeometry, MeshBasicMaterial, AmbientLight } from 'three';
import { RdRttScene } from '../rd/RdRttScene';
import { RdColorMat } from '../rd/RdColorMat';
import { RenderToTexture } from '../rtt/RenderToTexture';
import { ParamsRd } from '../data/ParamsRd';
import { Stage } from '../../../data/Stage';


export class MainRd{

    renderer    :THREE.WebGLRenderer;
    scene       :THREE.Scene;
    camera      :THREE.PerspectiveCamera;
    oCamera     :THREE.OrthographicCamera;
    control     :OrbitControls;

    stats       :Stats;
    isDebug     :boolean;
    clock       :THREE.Clock;
    _rdRttSceneA: RdRttScene;
    _plane      : THREE.Mesh;
    _planeMat      :RdColorMat;
    _rttTest    :RenderToTexture;
    _isRender:boolean=true;
    _count      :number=0;



    //projTest    :ProjTest;


    init(){
    
       ParamsRd.init();

       this.clock = new THREE.Clock(true);
       this.clock.start();
    
       this.renderer = new THREE.WebGLRenderer({
           canvas: document.querySelector('#webgl'),
           antialias: false
       });

        this.renderer.setPixelRatio(2);
        this.renderer.setClearColor(new THREE.Color(0x000000));
        this.renderer.setSize(Stage.width, Stage.height);
         
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(40, 640/480, 1, 10000);

        let stgW:number = Stage.width *0.3;
		let stgH:number = Stage.height *0.3;
		
        this.oCamera = new OrthographicCamera( -stgW, stgW, stgH, -stgH, 1, 10000);
		this.oCamera.position.set(0,0,900);
        this.oCamera.lookAt(new Vector3(0,0,0));

        //this.control = new OrbitControls(
        //    this.camera,
        //    this.renderer.domElement
        //)

        window.addEventListener('resize', ()=>{
            this.onWindowResize();
        }, false)
        this.onWindowResize();

        let d:DirectionalLight = new DirectionalLight(0xffffff);
        d.position.x = 10;
        d.position.y = 10;
        d.position.z = 10;
        this.scene.add(d);

        let aa:AmbientLight = new AmbientLight(0x666666);
        this.scene.add(aa);

        
		this._rdRttSceneA = new RdRttScene();
		this._rdRttSceneA.init(this.renderer);
			
        this._planeMat =new RdColorMat(
            this._rdRttSceneA.getCurrentBuffer(),
            
            512,
            512
        );
		this._plane = new THREE.Mesh( 
			new THREE.PlaneGeometry(1024, 1024, 1, 1), 
			this._planeMat
		);
		this.scene.add(this._plane);	

        //this._circles = new Circles();
        //this.scene.add(this._circles);
        
        //this.scene.add(cube);

        /*
        this._rttTest=new RenderToTexture();
        this._rttTest.init(this.renderer);
        this.scene.add(this._rttTest);
        */

        this.tick();

        ParamsRd.gui.add(this,"_isRender").listen();
    }

    tick(){
        
       //this._rttTest.visible=false;
        //this.control?.update();
        //this._rttTest.update();
        //this._circles.update();
        
        //this._plane.visible=false;
        //this._plane.rotation.y += 0.05;
        this._planeMat.update(
            this._rdRttSceneA.getCurrentBuffer()
        );
        if(this._isRender){
            this._rdRttSceneA.update();
        }
        
        
        this.renderer.render(this.scene, this.oCamera);
        //this.renderer.render(this.scene, this.camera);
        this._count++;
        
        //window.requestAnimationFrame(()=>{
        //    this.tick();
        //});

        window.setTimeout(()=>{
            this.tick();
        },1000/30)
    }


    onWindowResize(){

        /*
        const fovRad = (this.camera.fov / 2) * (Math.PI / 180);//角度
        let distance = (window.innerHeight / 2) / Math.tan(fovRad);//距離
        this.camera.position.set(0,0,distance);//距離を指定
        */
        //let scale:number = window.innerHeight/100;//大きさ指定
        this.camera.aspect = 1;
        this.camera.updateProjectionMatrix();
        this.camera.position.set(0,0,1000); 

        //でかい方に合わせるあれ
        let ww:number = Stage.width;
        let hh:number = Stage.height;

        console.log(ww,hh);
        let dom = this.renderer.domElement;
        let stgW:number = ww;
        let stgH:number = hh;
        let size:number = 0.3;//1-0.05;
        this.oCamera.left = -stgW*size;
        this.oCamera.right = stgW*size;
        this.oCamera.top = stgH*size;
        this.oCamera.bottom = -stgH*size;
        this.oCamera.updateProjectionMatrix();

        this.renderer.setSize(ww, hh);
    }

}