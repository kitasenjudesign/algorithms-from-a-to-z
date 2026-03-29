import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'lil-gui'
import { TorusGeometry, MeshPhongMaterial, DirectionalLight, OrthographicCamera, Vector3, BoxGeometry, MeshBasicMaterial, AmbientLight, Mesh, SphereGeometry, Camera, ObjectLoader, DataTexture } from 'three';
import { ParamsG } from './data/ParamsG';
import { CAMain } from './lifegame/CAMain';
import { BitmapData } from './myP5/BitmapData';
import { GameOfLifeP5src } from './GameOfLifeP5src';
import { Stage } from '../../data/Stage';

export class MainGameOfLife{

    counter:number=0;

    caMain      :CAMain;
    renderer    :THREE.WebGLRenderer;
    scene       :THREE.Scene;
    oCamera     :THREE.OrthographicCamera;
    controls     :OrbitControls;
    stats       :Stats;
    clock       :THREE.Clock;
    light       :THREE.DirectionalLight;
    src        :GameOfLifeP5src;


    init(){
        /*
        this.bitmapData = new BitmapData();
        this.bitmapData.init("./data/ring.png","emoji",128,128,()=>{
            this.onInit();
        });*/
        this.src = new GameOfLifeP5src();
        this.src.start(
            "G",
            ParamsG.resolution,
            ParamsG.resolution,
            ()=>{
                this.onInit();
            }
        );

    }

    onInit(){

        ParamsG.init();
        //Params.bitmapData = this.bitmapData;

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#webgl'),
            antialias: false
        });
         this.renderer.setPixelRatio(1);
         this.renderer.setClearColor(new THREE.Color(0));
         this.renderer.setSize(Stage.width, Stage.height);

        this.caMain = new CAMain();
        this.caMain.init(this.src,this.renderer,()=>{
            this.init2();
        });

        
    }

    init2(){

        //window.alert('a')

       this.clock = new THREE.Clock(true);
       this.clock.start();

        this.scene = new THREE.Scene();
        this.scene.add(this.caMain)

        this.oCamera = new THREE.OrthographicCamera(-1,1,1,-1,1,2000);
        this.oCamera.position.set(0,0,500);
        this.oCamera.lookAt(new Vector3());

        this.controls = new OrbitControls(this.oCamera,this.renderer.domElement);
        this.controls.enabled=false;

        window.addEventListener('resize', ()=>{
            this.onWindowResize();
        }, false)
        this.onWindowResize();

        this.light = new DirectionalLight(0xffcccc);
        this.light.intensity=0.7;
        this.light.position.x = 10;
        this.light.position.y = 10;
        this.light.position.z = 10;
        this.scene.add(this.light);

        let aa:AmbientLight = new AmbientLight(0xbbbbbb);
        this.scene.add(aa);

        ParamsG.gui.add(this,"reset");
        this.reset();
        this.tick();
    }

    reset(){

        this.caMain.reset();

    }


    tick(){
        
        this.caMain.update();
        this.controls.update();    
        
        this.renderer.render(this.scene, this.oCamera);
        
        setTimeout(()=>{
            this.tick();
        },1000/18)

    }


    onWindowResize(){
 
        //でかい方に合わせるあれ
        let ww:number = Stage.width;
        let hh:number = Stage.height;

        let cw = ww*0.05;
        let ch = hh*0.05;

        this.oCamera.left=-cw;
        this.oCamera.right=cw;
        this.oCamera.top=ch;
        this.oCamera.bottom=-ch;
        this.oCamera.updateProjectionMatrix();
        this.renderer.setSize(ww, hh);

    }

}