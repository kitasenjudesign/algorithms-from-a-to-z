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
import { Stage } from '../../data/Stage';


export class ThreeFontCanvas{

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

    constructor(){
        //this.init();
    }

    init(text:string="A",width:number=160,height:number=90){

        this.WIDTH = width;
        this.HEIGHT = height;

        this._fontManager = new FontManager();
        this._fontManager.init(text,(path)=>{     

            this._path = path;
            this.makeLetter();

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

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(this.ambientLight);

        let dd = new THREE.DirectionalLight(0xffffff, 0.5);
        dd.position.set(1, 2, 1);
        this.scene.add(dd);

        window.addEventListener('resize', ()=>{
            this.onWindowResize();
        }, false)
        
        this.onWindowResize();

    }

    makeLetter(){
        const txt = 'A';

        const loader = new FontLoader();
        // try to load a local typeface JSON. Provide a fallback to canvas text if it fails.
        loader.load('./data/helvetiker_regular.typeface.json', (font:any) => {

            let height = 10;
            const geom = new (TextGeometry as any)(txt, {
                font: font,
                size: 30,
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

            const mat = new MeshPhongMaterial({ color: 0xffffff });
            const mesh = new THREE.Mesh(geom, mat);
            mesh.position.set(0, 0, -height/2);
//            this.scene.add(mesh);

            this._container = new THREE.Object3D();
            this._container.add(mesh);
            this._container.position.set(0, 0, 0);
            this.scene.add(this._container);
            this.meshes.push(this._container);

        }, undefined, (err) => {
            console.warn('FontLoader failed, using canvas fallback', err);
            this._createTextFallback(txt);
        });
    }

    private _createTextFallback(text: string){
        // draw text to canvas and create a texture on a plane
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const size = 1024;
        canvas.width = size;
        canvas.height = size;
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,size,size);
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const fontSize = 160;
        ctx.font = `${fontSize}px sans-serif`;
        ctx.fillText(text, size/2, size/2);

        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
        const aspect = 1;
        const plane = new THREE.PlaneGeometry(800 * aspect, 800);
        const mesh = new THREE.Mesh(plane, mat);
        this.scene.add(mesh);
        this.meshes.push(mesh);
    }

    resetCam(){
        this.oCamera.position.set(0,0,3000);
  
    }

    

    tick(){

        this.control?.update();
        this.renderer.render(this.scene, this.oCamera);//this.oCamera);//this.camera);    

        if(this._container){
            this._container.rotation.x += 0.005;
            this._container.rotation.y += 0.004;
            this._container.rotation.z += 0.003;            
        }

        window.requestAnimationFrame(()=>{
            this.tick();
        });        

    }


    onWindowResize(){

        console.log("resize");

    

        let ww = this.WIDTH;
        let hh = this.HEIGHT;
        let size:number = 400;
        var stgW:number = ww*0.417;
        var stgH:number = hh*0.417;



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