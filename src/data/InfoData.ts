import { GUI } from 'lil-gui'
import { MyGUI } from './MyGUI';

export class InfoData{

    public title:string = "";
    public date:string = "";
    public author:string = "";
    public anotherTitle:string = "";
    public alphabet:string = "";
    public maxLetters:number = 0;

    public defaultLetter:string = "";

    constructor(
        alphabet:string,
        title:string,
        date:string,
        author:string,
        maxLetters:number=0,
        defaultLetter:string="",
        anotherTitle:string=""
    ){
        this.alphabet = alphabet;
        this.title = title;
        this.date = date;
        this.author = author;
        this.anotherTitle = anotherTitle;
        this.maxLetters = maxLetters;
        this.defaultLetter = defaultLetter;
    }

    public static TITLE:InfoData=new InfoData(
        "",
        "Algorithms from A to Z ",
        "",
        "Kitasenju Design",
        0,
        ""
    );

    public static A:InfoData=new InfoData(
        "A",
        "Ascii Art",
        "1966",
        "Kenneth Knowlton",
        8,
        "A"
    );

    public static B:InfoData=new InfoData(
        "B",
        "Boids",
        "1986",
        "Craig Reynolds",
        8,
        "B"
    );

    public static C:InfoData=new InfoData(
        "C",
        "Cellular Automaton",
        "1983",
        "Stephen Wolfram",
        8,
        "C"
    );

    public static D:InfoData=new InfoData(
        "D",
        "Differential Growth",
        "2014",
        "Andy Lomas",
        8,
        "D"
    );

    public static E:InfoData=new InfoData(
        "E",
        "Error Diffusion",
        "1976",
        "Robert W. Floyd and Louis Steinberg",
        8,
        "E"
    );

    public static F:InfoData=new InfoData(
        "F",
        "Fourier Transform",
        "1807",
        "Joseph Fourier",
        8,
        "F"
    );

    public static G:InfoData=new InfoData(
        "G",
        "Game of Life",
        "1970",
        "John Conway",
        10,
        "G"
    );

    public static H:InfoData=new InfoData(
        "H",
        "Hilbert Curve",
        "1891",
        "David Hilbert",
        1,
        "H"
    );

    public static I:InfoData=new InfoData(
        "I",
        "Inverse Kinematics",
        "1985",
        "Michael Girard and Anthony Maciejewski",
        10,
        "IK"
    );

    public static J:InfoData=new InfoData(
        "J",
        "Jarvis March",
        "1973",
        "R. A. Jarvis",
        10,
        "J"
    );

    public static K:InfoData=new InfoData(
        "K",
        "K-d Tree",
        "1975",
        "Jon Louis Bentley",
        3,
        "Kd"
    );

    public static L:InfoData=new InfoData(
        "L",
        "L-system",
        "1968",
        "Aristid Lindenmayer",
        10,
        "L"
    );

    public static M:InfoData=new InfoData(
        "M",
        "Maze Generation",
        "1882",
        "Charles Pierre Trémaux",
        10,
        "M"
    );

    public static N:InfoData=new InfoData(
        "N",
        "Navier-Stokes Equations",
        "1845",
        "Claude-Louis Navier and George Gabriel Stokes",
        10,
        "Navier"
    );

    public static O:InfoData=new InfoData(
        "O",
        "Opentype.js",
        "2014",
        "Frederik De Bleser",
        10,
        "Opentype"
    );

    public static P:InfoData=new InfoData(
        "P",
        "Perlin Noise",
        "1982",
        "Ken Perlin",
        10,
        "P"
    );

    public static Q:InfoData=new InfoData(
        "Q",
        "Quadtree",
        "1974",
        "Raphael Finkel and J.L. Bentley",
        10,
        "Q"
    );

    public static R:InfoData=new InfoData(
        "R",
        "Reaction Diffusion",
        "1984",
        "Peter Gray and Stephen K. Scott",
        10,
        "R"
    );

    public static S:InfoData=new InfoData(
        "S",
        "Spirograph",
        "1960",
        "Denys Fisher",
        10,
        "S"
    );

    public static T:InfoData=new InfoData(
        "T",
        "Ten Print",
        "1982",
        "Unknown",
        1,
        "T"
    );

    public static U:InfoData=new InfoData(
        "U",
        "Unsharp Mask",
        "1930s",
        "Unknown",
        10,
        "U"
    );

    public static V:InfoData=new InfoData(
        "V",
        "Verlet Integration",
        "1967",
        "Loup Verlet",
        10,
        "V"
    );

    public static W:InfoData=new InfoData(
        "W",
        "Wave Equation",
        "1783",
        "Jean le Rond d'Alembert",
        10,
        "W"
    );

    public static X:InfoData=new InfoData(
        "X",
        "XOR Blending",
        "1982",
        "Thomas Porter and Tom Duff",
        10,
        "X"
    );

    public static Y:InfoData=new InfoData(
        "Y",
        "YUV Color Space",
        "1960s",
        "Walter Bruch",
        10,
        "Y"
    );

    public static Z:InfoData=new InfoData(
        "Z",
        "Z-fighting",
        "1980s",
        "Unknown",
        10,
        "Z"
    );

    

    

}
