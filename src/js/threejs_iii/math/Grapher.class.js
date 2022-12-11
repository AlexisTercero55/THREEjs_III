/**
 * @author: Alexis Tercero
 * @mail : alexistercero55@gmail.com
 * @github: AlexisTercero55
 */
import * as THREE from 'three';
export class III_Grapher2D
{
    constructor(f,min,max,steps = 10, color=0x0000ff)
    {
        let x = min;
        const step = (max - min)/steps;
        const points = [];
        for(let i = 0; i < steps; i++)
        {
            points.push( new THREE.Vector3( x,f(x),0 ) );
            x += step;
        }
        const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        
        this.graph = new THREE.Line( geometry, material );
    }
}

export class III_CircleGraph
{
    constructor(radius, color=0x0000ff, steps = 64)
    {
        let angle = 0;
        //TODO : WHY (2 * Math.PI) / steps; CANT CLOSE THE CIRCLE
        const step = (2.1 * Math.PI) / steps;
        const points = [];
        for(let i = 0; i < steps; i++)
        {
            const x = Math.cos(angle);
            const y = Math.sin(angle);
            points.push( new THREE.Vector3( x,0,y ) );
            angle += step;
        }
        const material = new THREE.LineBasicMaterial({ color: color});
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        this.circle = new THREE.Line( geometry, material );
        this.circle.scale.set(radius,radius,radius);
    }

    nextFrame = ()=>{};
}
