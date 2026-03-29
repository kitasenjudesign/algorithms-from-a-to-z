import { GUI } from 'lil-gui'
import { PerspectiveCamera, Camera } from 'three';
import { ParamsC } from './ParamsC';
import { Stage } from '../../../data/Stage';

export class CameraUtil {

    public static Instance:CameraUtil;
    public camera:PerspectiveCamera;
    public p1:number = 0.071;
    public p2:number = 35.62;
    public p3:number = 0.1;
    public p4:number = 0.1;
    public p5:number =-0.000001;
    public projMatrix:THREE.Matrix4

    constructor(camera:PerspectiveCamera){
        
        CameraUtil.Instance=this;
        
        this.camera=camera;
        
        let aa = ParamsC.gui.addFolder("projMatrix");
        aa.close();

        aa.add(this,"p1",0.070,0.072).listen();
        aa.add(this,"p2",35.55,35.70).listen();
        aa.add(this,"p3",0,0.2).listen();
        aa.add(this,"p4",0,0.2).listen();
        aa.add(this,"p5",-0.000002,0.000001).listen();

    }
    
    public UpdateProjectionMatrix(){
        let sx = this.p3*Stage.height/Stage.width;
        let sy = this.p4;
        let p = this.p1;
        let p2 = this.p2;
		let m = this.camera.projectionMatrix.clone();        
		m.set(sx, 0, 0, 0,
          0, sy, 0, 0,
          0, 0, this.p5, p,
          0, 0, p, p2 );
        
        this.projMatrix = m;
    }

    public GetProjectionMatrix():THREE.Matrix4
	{
		return this.projMatrix;
	} 

}