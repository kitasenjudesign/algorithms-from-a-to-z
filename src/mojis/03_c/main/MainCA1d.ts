import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'lil-gui'
import { TorusGeometry, MeshPhongMaterial, DirectionalLight, OrthographicCamera, Vector3, BoxGeometry, MeshBasicMaterial, AmbientLight, Mesh, SphereGeometry, Camera, ObjectLoader, DataTexture } from 'three';
import { ParamsC } from '../data/ParamsC';
import { CAMain } from '../lifegame/CAMain';
import { Stage } from '../../../data/Stage';


export class MainCA1d{

    caMain      :CAMain;
    renderer    :THREE.WebGLRenderer;
    scene       :THREE.Scene;
    oCamera     :THREE.OrthographicCamera;
    controls     :OrbitControls;
    stats       :Stats;
    clock       :THREE.Clock;
    light       :THREE.DirectionalLight;
    
    init(){
        ParamsC.init();

        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#webgl'),
            antialias: false,
            preserveDrawingBuffer : true
        });
         this.renderer.setPixelRatio(1);
         this.renderer.setClearColor(new THREE.Color(0x000000));
         this.renderer.setSize(Stage.width,Stage.height);

        this.caMain = new CAMain();
        this.caMain.init(this.renderer,()=>{
            this.init2();
        })
    }

    init2(){

        this.clock = new THREE.Clock(true);
        this.clock.start();

        this.scene = new THREE.Scene();
        this.scene.add(this.caMain)

        this.oCamera = new THREE.OrthographicCamera(-1,1,1,-1,1,2000);
        this.oCamera.position.set(0,0,500);
        this.oCamera.lookAt(new Vector3());

        this.controls = new OrbitControls(this.oCamera,this.renderer.domElement);
        this.controls.enabled=false;

        this.light = new DirectionalLight(0xffcccc);
        this.light.intensity=0.7;
        this.light.position.x = 10;
        this.light.position.y = 10;
        this.light.position.z = 10;
        this.scene.add(this.light);

        let aa:AmbientLight = new AmbientLight(0xbbbbbb);
        this.scene.add(aa);

        ParamsC.gui.add(this,"reset");
        this.reset();
        this.tick();

        window.addEventListener('resize', ()=>{
            this.onWindowResize();
        }, false)
        this.onWindowResize();        
    }

    reset(){
        this.caMain.reset();
    }



    tick(){
        
        this.caMain.update();
        this.controls.update();
        //this.plane.update(this.caMain.getCurrentTexture());

        this.renderer.render(this.scene, this.oCamera);
        
        setTimeout(()=>{
            this.tick();
        },1000/15)

    }

    onWindowResize(){

        let ww:number = Stage.width;
        let hh:number = Stage.height;

        let cw = 128/2;
        let ch = 128/2;

        this.oCamera.left=-64;
        this.oCamera.right=64;
        this.oCamera.top=128/2;
        this.oCamera.bottom=-128/10;
        this.oCamera.updateProjectionMatrix();
        this.renderer.setSize(ww, hh);

        let dom = this.renderer.domElement;
        dom.style.position = "absolute";

        this.caMain.resize(0, 0, ww, hh);
    }

}