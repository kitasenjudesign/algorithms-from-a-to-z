import * as THREE from 'three';
import { DataTexture, Vector2 } from 'three';
import { ParamsG } from '../data/ParamsG';

export class ColorTex{

    tex:THREE.DataTexture;

    constructor() 
    {
        const width = 8;
        const height = 1;   
        const size = width * height;
        const data = new Uint8Array( 4 * size );
        const color = new THREE.Color( 0xffffff );
        
        const r = Math.floor( color.r * 255 );
        const g = Math.floor( color.g * 255 );
        const b = Math.floor( color.b * 255 );
        
        for ( let i = 0; i < size; i ++ ) {
        
            const stride = i * 4;
        
            data[ stride ] = Math.random()*255;
            data[ stride + 1 ] = Math.random()*255;
            data[ stride + 2 ] = Math.random()*255;
            data[ stride + 3 ] = 255;
        
        }
        
        // used the buffer to create a DataTexture
        
        this.tex = new THREE.DataTexture( data, width, height );
        this.tex.needsUpdate = true;

    }


}