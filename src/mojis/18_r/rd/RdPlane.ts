import * as THREE from 'three';
import { RdShaderMat } from './RdShaderMat';


export class RdPlane extends THREE.Mesh{

    _mat    :RdShaderMat;
	_geo    :THREE.PlaneGeometry;

	constructor() 
	{
		let geo = new THREE.PlaneGeometry(2, 2, 1, 1);
		let mat = new RdShaderMat();
		super(geo, mat);
		
        this._mat           = mat;
        this.frustumCulled  = false;
        //this.renderOrder=0;
		//this.renderDepth = 0;
		
	}
	
	//buffer wo watashiteiru
	public update(
		buffer1:THREE.WebGLRenderTarget
	) {
		this._mat.update(buffer1);
	}


}