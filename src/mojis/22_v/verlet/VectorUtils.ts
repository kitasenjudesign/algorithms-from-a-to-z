import { Vector3 } from "three";

export class VectorUtils {

    public static limit(tgt:Vector3, lim:number):Vector3{
		
		if (tgt.length() > lim){
			tgt = tgt.normalize().multiplyScalar(lim);
		}
		
		return tgt;
		
	}

	public static getLength(v1:Vector3, v2:Vector3):number{
		
			var dx:number = v1.x - v2.x;
			var dy:number = v1.y - v2.y;
			var dz:number = v1.z - v2.z;
			var dist:number = Math.sqrt( dx * dx + dy * dy + dz * dz );	
			
		return dist;
		
	}

}