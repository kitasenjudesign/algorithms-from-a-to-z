import { GUI } from 'lil-gui'
import { MyGUI } from './MyGUI';

export class InfoData{

    public title:string = "";
    public date:string = "";
    public author:string = "";
    public anotherTitle:string = "";
    public alphabet:string = "";
    constructor(
        alphabet:string,
        title:string,
        date:string,
        author:string,
        anotherTitle:string=""
    ){
        this.alphabet = alphabet;
        this.title = title;
        this.date = date;
        this.author = author;
        this.anotherTitle = anotherTitle;
    }

    public static TITLE:InfoData=new InfoData(
        "",
        "Algorithms from A to Z ",
        "",
        ""
    );

    public static A:InfoData=new InfoData(
        "A",
        "Ascii Art",
        "1966",
        "Kenneth Knowlton"
    );

    public static B:InfoData=new InfoData(
        "B",
        "Boids",
        "1986",
        "Craig Reynolds"
    );

    public static C:InfoData=new InfoData(
        "C",
        "Cellular Automaton",
        "1983",
        "Stephen Wolfram",
        ""
    );

    public static D:InfoData=new InfoData(
        "D",
        "Differential Growth",
        "2014",
        "Andy Lomas"
    );

    public static E:InfoData=new InfoData(
        "E",
        "Error Diffusion",
        "1976",
        "Robert W. Floyd and Louis Steinberg"
    );

    public static F:InfoData=new InfoData(
        "F",
        "Fourier Transform",
        "1807",
        "Joseph Fourier"
    );

    public static G:InfoData=new InfoData(
        "G",
        "Game of Life",
        "1970",
        "John Conway"
    );

    public static H:InfoData=new InfoData(
        "H",
        "Hilbert Curve",
        "1891",
        "David Hilbert"
    );

    public static I:InfoData=new InfoData(
        "I",
        "Inverse Kinematics",
        "1985",
        "Michael Girard and Anthony Maciejewski"
    );

    public static J:InfoData=new InfoData(
        "J",
        "Jarvis March",
        "1973",
        "R. A. Jarvis"
    );

    public static K:InfoData=new InfoData(
        "K",
        "K-d Tree",
        "1975",
        "Jon Louis Bentley"
    );

    public static L:InfoData=new InfoData(
        "L",
        "L-system",
        "1968",
        "Aristid Lindenmayer"
    );

    public static M:InfoData=new InfoData(
        "M",
        "Maze Generation",
        "1882",
        "Charles Pierre Trémaux",
        ""
    );

    public static N:InfoData=new InfoData(
        "N",
        "Navier-Stokes Equations",
        "1845",
        "Claude-Louis Navier and George Gabriel Stokes"
    );

    public static O:InfoData=new InfoData(
        "O",
        "Opentype.js",
        "2014",
        "Frederik De Bleser"
    );

    public static P:InfoData=new InfoData(
        "P",
        "Perlin Noise",
        "1982",
        "Ken Perlin"
    );

    public static Q:InfoData=new InfoData(
        "Q",
        "Quadtree",
        "1974",
        "Raphael Finkel and J.L. Bentley"
    );

    public static R:InfoData=new InfoData(
        "R",
        "Reaction Diffusion",
        "1984",
        "Peter Gray and Stephen K. Scott"
    );

    public static S:InfoData=new InfoData(
        "S",
        "Spirograph",
        "1960",
        "Denys Fisher"
    );

    public static T:InfoData=new InfoData(
        "T",
        "Ten Print",
        "1982",
        "Unknown"
    );

    public static U:InfoData=new InfoData(
        "U",
        "Unsharp Mask",
        "1930s",
        "Unknown"
    );

    public static V:InfoData=new InfoData(
        "V",
        "Verlet Integration",
        "1967",
        "Loup Verlet"
    );

    public static W:InfoData=new InfoData(
        "W",
        "Wave Equation",
        "1783",
        "Jean le Rond d'Alembert"
    );

    public static X:InfoData=new InfoData(
        "X",
        "XOR Blending",
        "1982",
        "Thomas Porter and Tom Duff"
    );

    public static Y:InfoData=new InfoData(
        "Y",
        "YUV Color Space",
        "1960s",
        "Walter Bruch"
    );

    public static Z:InfoData=new InfoData(
        "Z",
        "Z-fighting",
        "1980s",
        "Unknown"
    );

    

    

}
