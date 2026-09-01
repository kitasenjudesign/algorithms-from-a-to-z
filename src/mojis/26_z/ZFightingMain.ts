import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { TorusGeometry, MeshPhongMaterial, DirectionalLight, OrthographicCamera } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import gsap from 'gsap';
import { FontManager } from '../../font/FontManager';
import { Path } from 'opentype.js';
import { PathWrapper } from '../../font/PathWrapper';
import { WorkBase } from '../00_base/WorkBase';
import { InfoData } from '../../data/InfoData';
import { Stage } from '../../data/Stage';
import { TitleView } from '../../html/TitleView';
import { Params } from '../../data/Params';


export class ZFightingMain extends WorkBase{

    WIDTH:number = 160;
    HEIGHT:number = 90;

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

    meshes:THREE.Object3D[] = [];   
    ambientLight:THREE.AmbientLight;

    _fontManager    :FontManager;
    _path           :PathWrapper;
    
    _container:THREE.Object3D;
    _container2:THREE.Object3D;

    _rot1:THREE.Vector3 = new THREE.Vector3();
    _rot2:THREE.Vector3 = new THREE.Vector3();

    constructor(){
        
        super(InfoData.Z);
        this.showTitle();

        //this.init();
    }

    init(){
    
        this._fontManager = new FontManager();
        this._fontManager.init("A",(path)=>{     

            this._path = path;
            this.makeLetter();
            TitleView.setBasePosition(100,Stage.height-TitleView.getSize().height-100);
            TitleView.setPosition();
        });


       this.clock = new THREE.Clock(true);
       this.clock.start();
    
       let dom = document.getElementById("webgl");
       this.renderer = new THREE.WebGLRenderer({
           canvas: dom,//document.querySelector('#webgl'),
           antialias: false,
           preserveDrawingBuffer : true
       });

       this.renderer.setPixelRatio(1);
       
       

        this.renderer.setPixelRatio(1);
        this.renderer.setClearColor(new THREE.Color(0x000000));
        this.renderer.setSize(Stage.width,Stage.height);
         
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(40, 640/480, 0.001, 1000000);
               
    
        var stgW:number =Stage.width *0.4;
        var stgH:number =Stage.height *0.4;

        this.oCamera = new OrthographicCamera( -stgW, stgW, stgH, -stgH, 1, 10000);


        this.resetCam();

        this.control = new OrbitControls(this.oCamera,dom)
        this.control.enabled=false;

        this.tick();

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(this.ambientLight);

        let dd = new THREE.DirectionalLight(0xffffff, 1.5);
        dd.position.set(1.2, 3, 1);
        this.scene.add(dd);

        window.addEventListener('resize', ()=>{
            this.onWindowResize();
        }, false)
        
        this.onWindowResize();
        
        //this.resetCam();

    }

    makeLetter(){
        const txt = Params.alphabet || "Z";

        const loader = new FontLoader();
        // try to load a local typeface JSON. Provide a fallback to canvas text if it fails.
        loader.load('./data/helvetiker_regular.typeface.json', (font:any) => {


            this._container=this.makeMesh(txt,font,0xffffff);
            this.scene.add(this._container);
            this.meshes.push(this._container);

            this._container2=this.makeMesh(txt,font,0x888888);
            this.scene.add(this._container2);
            this.meshes.push(this._container2);

            this._container.position.x  = 100;            
            this._container2.position.x = -100; 

            /*
            this._container.rotation.x = 0.001*(Math.random()-0.5);
            this._container.rotation.y = 0.001*(Math.random()-0.5);
            this._container.rotation.z = 0.001*(Math.random()-0.5);
            */
                

            this.motion1();

                        
        }, undefined, (err) => {
            console.warn('FontLoader failed, using canvas fallback', err);
            //this._createTextFallback(txt);
        });
    }

    motion1(){
         gsap.to(this._container.position,{
                x: Math.random()*0.0001,
                y: Math.random()*0.0001,
                z: Math.random()*0.0001,
                duration:8
            })
            gsap.to(this._container2.position,{
                x: Math.random()*0.0001,
                y: Math.random()*0.0001,
                z: Math.random()*0.0001,
                duration:8,
                onComplete:()=>{
                    this.motion2();
                }
            })        

            
               
    }

    motion2(){

        let tgtX = 20*(Math.random()-0.5);
        let tgtY = 20*(Math.random()-0.5);
        gsap.to(this._container.position,{
            x: tgtX,
            y: tgtY,
            duration:3,
            ease: "power1.inOut"
            })
            gsap.to(this._container2.position,{
            x: -tgtX,
            y: -tgtY,
                duration:3,
                ease: "power1.inOut",
                onComplete:()=>{
                    this.motion2();
                }

            })         

    }

    makeMesh(txt:string,font:any,col:number):THREE.Object3D{
        let height = 10;

        const geom = new (TextGeometry as any)(txt, {
            font: font,
            size: 150,
            height: height,
            curveSegments: 12
        });

        geom.computeBoundingBox && geom.computeBoundingBox();
        // center geometry
        if (geom.boundingBox) {
            const offsetX = -0.5 * (geom.boundingBox.max.x - geom.boundingBox.min.x);
            const offsetY = -0.5 * (geom.boundingBox.max.y - geom.boundingBox.min.y);
            geom.translate(offsetX, offsetY, 0);
        }

        const mat = new MeshPhongMaterial({ color: col });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(0, 0, -height/2);

        var container = new THREE.Object3D();
        container.add(mesh);
        container.position.set(0, 0, 0);

        return container;
    }
    

    resetCam(){

        this.oCamera.position.set(-1200,-1200,3000);
        this.oCamera.lookAt(new THREE.Vector3(0,0,0));
  
    }

    

    tick(){

        this.control?.update();
        this.renderer.render(this.scene, this.oCamera);//this.oCamera);//this.camera);    

        if(this._container&&this._container2){
            /*
            this._container.rotation.x = 0.001*(Math.random()-0.5)+this._rot1.x;
            this._container.rotation.y = 0.001*(Math.random()-0.5)+this._rot1.y;
            this._container.rotation.z = 0.001*(Math.random()-0.5)+this._rot1.z;

            this._container2.rotation.x = 0.001*(Math.random()-0.5)+this._rot2.x;
            this._container2.rotation.y = 0.001*(Math.random()-0.5)+this._rot2.y;
            this._container2.rotation.z = 0.001*(Math.random()-0.5)+this._rot2.z;
            */
        }

        setTimeout(()=>{
            this.tick();
        },1000/60)
        window.requestAnimationFrame(()=>{
            
        });        

    }


    onWindowResize(){

        //console.log("resize");

       
        let ww = Stage.width;//this.WIDTH;
        let hh = Stage.height;
        let size:number = 400;
        var stgW:number = ww*0.15;
        var stgH:number = hh*0.15;


       
        this.oCamera.top=stgH;
        this.oCamera.bottom=-stgH;
        this.oCamera.left=-stgW;
        this.oCamera.right=stgW;
        this.oCamera.updateProjectionMatrix();
        
        this.renderer.setSize(ww,hh);

    }

    /**
     * WebGL のフレームバッファから生の RGBA バイト列を取得する
     * (返り値は bottom-up、行は左から右。要反転して ImageData に使う)
     */
    captureRawPixels(x = 0, y = 0, width?: number, height?: number): Uint8Array {
        const canvas = this.renderer.domElement as HTMLCanvasElement;
        const gl = this.renderer.getContext() as WebGLRenderingContext | WebGL2RenderingContext;
        const w = width ?? canvas.width;
        const h = height ?? canvas.height;
        const pixels = new Uint8Array(w * h * 4);
        // 読み取り先は現在の既定フレームバッファ（画面）
        gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        return pixels;
    }

    /**
     * captureRawPixels の結果を ImageData (top-down) にして返す
     */
    captureImageData(): ImageData {
        const canvas = this.renderer.domElement as HTMLCanvasElement;
        const w = canvas.width;
        const h = canvas.height;
        const raw = this.captureRawPixels(0, 0, w, h);
        const flipped = new Uint8ClampedArray(w * h * 4);
        // WebGL readPixels は下から上に返すので行を反転する
        for (let row = 0; row < h; row++) {
            const srcStart = row * w * 4;
            const destStart = (h - row - 1) * w * 4;
            flipped.set(raw.subarray(srcStart, srcStart + w * 4), destStart);
        }
        return new ImageData(flipped, w, h);
    }


}