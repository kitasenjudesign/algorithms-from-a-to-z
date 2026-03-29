import { Object3D, Mesh, Vector3, SphereGeometry, MeshLambertMaterial, MeshBasicMaterial, CircleGeometry } from 'three';

export class CircleObj extends Object3D{

    public r   :number=10;
    //public pos :THREE.Vector3;
    public mesh :Mesh;
    private static geo :THREE.CircleGeometry;
    private static mat :THREE.MeshBasicMaterial;
    
    private count:number = 0;

    constructor(){

        super();
      //  this.pos = new Vector3(0,0,0);
        if(CircleObj.geo==null){
            CircleObj.geo = new CircleGeometry(1,20);
        }  
        if(CircleObj.mat==null){
            CircleObj.mat = new MeshBasicMaterial({color:0xffffff});
        }  
    }

    public makeObj(p:THREE.Vector3,r:number){

        this.count=0;
        let col:number = 0xffffff;//Math.random()<0.5 ? 0x000000 : 0xffffff;
        CircleObj.mat.color.setHex(col);
        this.mesh = new Mesh(
            CircleObj.geo,
            CircleObj.mat
        );
        this.add(this.mesh);

        this.scale.set(r*0.85,r*0.85,r*0.85);
        this.position.set(p.x,p.y,p.z);
        this.r = r;
        this.visible=true;

    }

    public update(){

        /*
        this.scale.x-=0.04;
        this.scale.y-=0.04;
        if(this.scale.x<0)this.scale.x=0;
        if(this.scale.y<0)this.scale.y=0;
        */
        //if(this.count++>=3)this.visible=false;
        //this.visible = Math.random()<0.5?true:false;
    }

}