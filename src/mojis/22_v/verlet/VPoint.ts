import { BoxGeometry, Mesh, MeshBasicMaterial, MeshPhongMaterial, SphereGeometry, Vector3 } from "three";

export class VPoint{

	private _prevPosition:Vector3;
		
	private _firstPos   :Vector3;
	public _fixed       :boolean=false;
	public _basePos     :Vector3;
    public position     :THREE.Vector3;


    constructor(){
        this.position = new Vector3();
        this._prevPosition = new Vector3();		
    }


	/**
	 * setPosition
	 * @param	p
	 */
	public setPosition(px:number,py:number,pz:number){
		
		if ( this._firstPos == null ){
			this._firstPos = new Vector3(px, py, pz);
		}
		
		this.position.x = px;
		this.position.y = py;
		this.position.z = pz;
		
		this._prevPosition.x = px;
		this._prevPosition.y = py;
		this._prevPosition.z = pz;
		
	}
	
	/**
	 * setVelocity
	 * @param	v
	 */
	public  setVelocity(vx:number,vy:number,vz:number) {
		
		//_prevPosition = position.copy().sub(v);
		this._prevPosition.x = this.position.x - vx;
		this._prevPosition.y = this.position.y - vy;
		this._prevPosition.z = this.position.z - vz;
		
	}

	public  setVelocityX(vx:number){
		this._prevPosition.x = this.position.x - vx;
	}
	public  setVelocityY(vy:number){
		this._prevPosition.y = this.position.y - vy;
	}
	public  setVelocityZ(vz:number){
		this._prevPosition.z = this.position.z - vz;
	}
	
	/*
	 * getVelocity()
	 * vx, vy, vz
	 */
	public  getVelocity():Vector3 {
		
		return new Vector3(
			this.getVelocityX(),
			this.getVelocityY(),
			this.getVelocityZ()		
		);
		
	}	
	
	public  getVelocityLength():number{
		
		var xx:number = this.getVelocityX();
		var yy:number = this.getVelocityY();
		var zz:number = this.getVelocityZ();
		return Math.sqrt( 
			xx*xx + yy*yy + zz*zz
		);
	}
	
	public  getVelocityX():number{
		return this.position.x - this._prevPosition.x;
	}

	public  getVelocityY():number{
		return this.position.y - this._prevPosition.y;
	}

	public  getVelocityZ():number{
		return this.position.z - this._prevPosition.z;
	}
	
	
	public  update() {
		
		var tmpX:number = this.position.x;
		var tmpY:number = this.position.y;  
		var tmpZ:number = this.position.z;
		


		if(this._fixed){

			this.position.x = this._basePos.x;
			this.position.y = this._basePos.y;
			this.position.z = this._basePos.z;

			this._prevPosition.x=this.position.x;
			this._prevPosition.y=this.position.y;
			this._prevPosition.z=this.position.z;
			
			this.setVelocity(0,0,0);

		}else{

			this.position.x += this.getVelocityX();
			this.position.y += this.getVelocityY();
			this.position.z += this.getVelocityZ();

			this.position.y += 0.05;
			/*
			this.position.x += (this._basePos.x-this.position.x)/1000;
			this.position.y += (this._basePos.y-this.position.y)/1000;
			this.position.z += (this._basePos.z-this.position.z)/1000;
			*/

			//this.rotation.x += this.getVelocityX() * 0.01;
			//this.rotation.y += this.getVelocityY() * 0.01;
			//this.rotation.z += this.getVelocityZ() * 0.01;
			
			this._prevPosition.x = tmpX; 
			this._prevPosition.y = tmpY;
			this._prevPosition.z = tmpZ;
	

		}


		
		
	}
	


	public  reset(){
		
		this.position.copy(this._firstPos);
	    this._prevPosition.copy(this._firstPos);
		this.setVelocity(0,0,0)
	}

}