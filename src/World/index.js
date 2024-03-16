import { Point, AABB, QuadTree, Circle } from "./Quadtree"
import Atom from './Atom'

export default class World 
{
  constructor(p, n)
  {
    this.p = p
    this.numGroups = n
    this.atoms = []
  }

  setup()
  {
    this.minDist = new Array(this.numGroups)
    this.forces = new Array(this.numGroups)
    this.radii = new Array(this.numGroups)

    this.colors = [
      "#264653", 
      "#2a9d8f", 
      "#e9c46a", 
      "#f4a261", 
      "#e76f51", 
      "#e5e5e5"
    ]

    for(let i = 0; i < this.numGroups; i++)
    {
      this.forces[i]  = new Array(this.numGroups)
      this.minDist[i] = new Array(this.numGroups)
      this.radii[i]   = new Array(this.numGroups)
    }

    this.setParams()
    console.log((1 + Math.sqrt(5)) / 2)
  }

  setParams()
  {
    for(let i = 0; i < this.numGroups; i++)
    {
      for(let j = 0; j < this.numGroups; j++)
      {
        this.forces[i][j]   = this.p.random(-5, 5)
        this.minDist[i][j]  = this.p.random(30, 50)
        this.radii[i][j]    = this.p.random(50, 250)
      }
    }
  }

  fill(location, nAtoms, scalar)
  {
    let turnFraction = (1 + Math.sqrt(5)) / 2

    for(let i = 0; i < nAtoms; i++)
    {
      let dst = Math.pow(i / (nAtoms - 1), 0.5)
      let angle = 2 * Math.PI * turnFraction * i 
      
      let x = dst * Math.cos(angle) * scalar
      let y = dst * Math.sin(angle) * scalar
      
      this.atoms[i] = new Atom(
        this.p, 
        location.x - x,
        location.y - y,
        4, 
        this.numGroups
      )
    }
  }

  draw(isRunning)
  {
    this.p.background(0)

    let boundary = new AABB(
      this.p.windowWidth/2, 
      this.p.windowHeight/2, 
      this.p.windowWidth, 
      this.p.windowHeight
    )

    this.qt = new QuadTree(boundary, 4)

    for(let a of this.atoms)
    {
      let point = new Point(a.pos.x, a.pos.y, a)
      this.qt.insert(point)

      a.draw(this.colors[a.type])
    }

    if(!isRunning) return 

    for(let a of this.atoms)
    {
      let range = new AABB(a.pos.x, a.pos.y, 50, 50)
      let pts = this.qt.query(range)
    
      for(let pnt of pts)
      {
        let other = pnt.userData

        if(a !== other)
        {
          a.rule(other, this.minDist, this.forces, this.radii)
        }
      }
    }
  }
}