import * as THREE from 'three';
import { Camera, Matrix4, Object3D, OrthographicCamera, Texture, TextureLoader, Vector3 } from 'three';

export class RenderToTexture extends Object3D{

    private _scene		:THREE.Scene;
	private _camera		:THREE.PerspectiveCamera;
	private _renderer	:THREE.WebGLRenderer;
	private _buffer1	:THREE.WebGLRenderTarget;
	private mesh        :THREE.Mesh;
    private outputMesh  :THREE.Mesh;

    constructor(){
        super();
    }

    public init(renderer:THREE.WebGLRenderer):void{
		
		this._renderer = renderer;
		
		let aspect:number = 1;
		
        this._camera = new THREE.PerspectiveCamera(40, 1, 30, 3000);
		this._camera.position.z = 1000;
		this._camera.lookAt( new THREE.Vector3() );
		
		this._scene  = new THREE.Scene();

		let param = { 
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter, 
            format: THREE.RGBAFormat, 
            stencilBuffer: false 
        };

        this._buffer1 = new THREE.WebGLRenderTarget( 1024, 1024, param );	
        
		this.mesh = new THREE.Mesh(
			new THREE.BoxGeometry(360,360,1,1), 
			new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide})
		);
		this._scene.add(this.mesh);
        
        let mat = new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide})
        this.outputMesh = new THREE.Mesh(
			new THREE.PlaneGeometry(260,260,1,1), 
			mat
        )
        mat.map = this._buffer1.texture;// as any;
        this.add(this.outputMesh);

	}
	
	public update():void{
		
        this.rotation.x+=0.005;        
        this.rotation.y+=0.005;

        this.rotation.y+=0.005;

        this.mesh.rotation.y+=0.1;

        this._renderer.setClearColor(0x00ff00);
        this._renderer.setRenderTarget(this._buffer1);
        this._renderer.clear();
        this._renderer.render(this._scene, this._camera);//, this._buffer1);

        this._renderer.setClearColor(0x0000ff);        
        this._renderer.setRenderTarget(null);
        this._renderer.clear();

	}
	
}