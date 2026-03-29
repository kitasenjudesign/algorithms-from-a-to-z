import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { TorusGeometry, MeshPhongMaterial, DirectionalLight, OrthographicCamera } from 'three';
import gsap from 'gsap';
import { FontManager } from '../../font/FontManager';
import { Path } from 'opentype.js';
import { PathWrapper } from '../../font/PathWrapper';
import { Stage } from '../../data/Stage';


export class ThreeBase{

    renderer    :THREE.WebGLRenderer;
    scene       :THREE.Scene;
    camera      :THREE.PerspectiveCamera;
    oCamera     :THREE.OrthographicCamera;
    control     :OrbitControls;

    stats       :Stats;
    isDebug     :boolean;
    clock       :THREE.Clock;
    bgColor:{color:number} = {color:0xcccccc}
    opacity:number = 1

    meshes:THREE.Mesh[] = [];   
    ambientLight:THREE.AmbientLight;

    _fontManager    :FontManager;
    _path           :PathWrapper;

    constructor(){
        //this.init();
    }

    init(){
    
        this._fontManager = new FontManager();
        this._fontManager.init("Z",(path)=>{     

            this._path = path;
            this.makeLetter();
        });


       this.clock = new THREE.Clock(true);
       this.clock.start();
    
       let dom = document.getElementById("webgl");
       this.renderer = new THREE.WebGLRenderer({
           canvas: dom,//document.querySelector('#webgl'),
           antialias: true,
           preserveDrawingBuffer : true
       });

       this.renderer.setPixelRatio(1);
       
       

        this.renderer.setPixelRatio(1);
        this.renderer.setClearColor(new THREE.Color(0x000000));
        this.renderer.setSize(Stage.width,Stage.height);
         
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(40, 640/480, 0.001, 100000);
        var stgW:number = Stage.width *0.4;
        var stgH:number = Stage.height *0.4;

        this.oCamera = new OrthographicCamera( -stgW, stgW, stgH, -stgH, 1, 10000);



        this.control = new OrbitControls(this.oCamera,dom)
//        this.control.enabled = false;
        let d:DirectionalLight = new DirectionalLight(0xffffff);
        this.scene.add(d);
       
        this.resetCam();
        this.tick();

        this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(this.ambientLight);





        window.addEventListener('resize', ()=>{
            this.onWindowResize();
        }, false)
        
        this.onWindowResize();

    }

    makeLetter(){

        let box = this._path.getBoundingBox();
        let size = {
            x:300,
            y:-400
        }

        console.log("aaa")
        let num=20;
        for(let i=0;i<num;i++){
            let m = new THREE.Mesh(new THREE.PlaneGeometry(580,580,1,1), new MeshPhongMaterial({
                color:Math.random()*0xffffff,
                side:THREE.DoubleSide
            }));
            
            let pos = this._path.getStrokes()[0].pointAt(i/num);

            m.position.x = -pos.x*40;
            m.position.y = pos.y*20;
            m.position.z = (Math.random()-0.5)*0.001;

            m.rotation.x = (Math.random()-0.5)*0.0001;
            m.rotation.y = (Math.random()-0.5)*0.0001;
            m.rotation.z = (Math.random()-0.5)*0.0001;

//            this.meshes.push(m);
            this.scene.add(m)


        }

    }

    resetCam(){
        this.oCamera.position.set(0,0,3000);
  
    }

    

    tick(){

        this.control?.update();
        this.renderer.render(this.scene, this.oCamera);//this.oCamera);//this.camera);    

        window.requestAnimationFrame(()=>{
            this.tick();
        });        

    }


    onWindowResize(){

        console.log("resize");

        let ww = Stage.width;
        let hh = Stage.height;
        let size:number = 400;
        var stgW:number = ww*0.417;
        var stgH:number = hh*0.417;


        /*
        if(window.innerHeight>){
            //縦長
            stgW = size *0.6;
            stgH = size  * aspect * 0.6;
        }*/

        this.oCamera.top=stgH;
        this.oCamera.bottom=-stgH;
        this.oCamera.left=-stgW;
        this.oCamera.right=stgW;
        this.oCamera.updateProjectionMatrix();

        this.renderer.setSize(Stage.width, Stage.height);

    }

}