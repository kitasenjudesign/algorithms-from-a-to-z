import * as THREE from 'three';
import { VPoint } from './VPoint';
import { VectorUtils } from './VectorUtils';
//import { VectorUtils } from './VectorUtils';


export class VStick {

	public _p1:VPoint;
	public _p2:VPoint;
	
	private _count:number = 0;
	
	public length:number;
	public lengthRatio:number=1;
	
	private static _mat:THREE.LineBasicMaterial;
	public visible:boolean = true;
	private _hardness:number = 5;//1;

    constructor(p1:VPoint,p2:VPoint,hardness:number=0.25){
		
        this._p1 = p1;
		this._p2 = p2;
		//var p1:Vector3 = _p1.position;
		//var p2:Vector3 = _p2.position;
		//_p2.position;
		this._hardness = hardness;
		
		this.length = VectorUtils.getLength(
            this._p1.position,
            this._p2.position
        );// p1.clone().sub(p2).length();
		
    }


	public update(nobi:number){
		
		//aとpを
		
			//var dist:number = _p1.position.dist(_p2.position);
			
			if (!this.visible){
				return;
			}

			/*
			var delta = this._point1.subtract(this._point0);
			var distance = delta.getLength();
			var difference = this._length - distance;

			var offsetX = (difference * delta.x / distance) * 0.5;
			var offsetY = (difference * delta.y / distance) * 0.5;
			this._point0.addCoordinates(-offsetX, -offsetY);
			this._point1.addCoordinates(offsetX, offsetY);			
			*/


			//delta= p1とp2の差分
			var dx:number = this._p1.position.x - this._p2.position.x;
			var dy:number = this._p1.position.y - this._p2.position.y;
			var dz:number = this._p1.position.z - this._p2.position.z;

			//距離, distance
			//var dist:number = Math.sqrt( dx * dx + dy * dy + dz * dz );
			var dist:number = ( dx * dx + dy * dy + dz * dz );
			

			//実際の長さと現状の長さ
			var diff:number = (this.length*this.length)*this.lengthRatio - dist;//理想からの差分 difference
			
            
			//こわれる
			
			/*
			if (diff > 30){
				if( this._count++> 10 ){
					this._count = 0;
					this.visible = false;	
				}
			}else{
				this._count=0;
			}*/
			
			
			var mm:number = ( diff / dist )  * nobi;//0.15;
			
			var offsetX:number = dx * mm; //_p1.position.copy().sub(_p2.position).mult(diff / dist / 2);
			var offsetY:number = dy * mm;
			var offsetZ:number = dz * mm;
			
			this._p1.position.x += offsetX;
			this._p1.position.y += offsetY;
			this._p1.position.z += offsetZ;
			
			this._p2.position.x -= offsetX;	
			this._p2.position.y -= offsetY;
			this._p2.position.z -= offsetZ;	
			
	}
	
	public  reset()
	{
		
		this._p1.reset();
		this._p2.reset();			
		this.visible = true;
		
	}    

}