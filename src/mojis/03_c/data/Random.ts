import { GUI } from 'lil-gui'
import { DirectionalLight } from 'three';
import { MyGUI } from './MyGUI';

export class Random {

    public static get value(): number {
        let hoge = window as any;
        if(hoge.fxrand==null) return Math.random();
        return hoge.fxrand();
    }

}