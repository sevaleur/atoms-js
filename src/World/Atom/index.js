export default class Atom 
{
  constructor(p, x, y, r, numTypes)
  {
    this.p        = p
    this.r        = r
    this.type     = Math.floor(this.p.random(0, numTypes))
    this.vel      = this.p.createVector(0, 0)
    this.pos      = this.p.createVector(x, y)

    this.K        = 0.1 
    this.friction = 0.9
    this.mass     = this.r*2
  }

  att(dist, radii, forces, other)
  {
    this.frc = this.dir.copy()
    this.frc.mult(forces[this.type][other.type])
    this.frc.mult(this.p.map(dist, 0, radii[this.type][other.type], 1, 0))
    this.frc.mult(this.K)
    
    this.tFrc.add(this.frc)
  }

  repel(dist, minDist, forces, other)
  {
    this.frc = this.dir.copy()
    this.frc.mult(Math.abs(forces[this.type][other.type]) * -3)
    this.frc.mult(this.p.map(dist, 0, minDist[this.type][other.type], 1, 0))
    this.frc.mult(this.K)

    this.tFrc.add(this.frc)
  }

  rule(other, minDist, forces, radii)
  {
    this.dir  = this.p.createVector(0, 0)
    this.tFrc = this.p.createVector(0, 0)
    this.acc  = this.p.createVector(0, 0)
    this.frc  = this.p.createVector(0, 0)

    let dist

    this.dir.mult(0)
    this.dir = other.pos.copy()
    this.dir.sub(this.pos)

    dist = this.dir.mag()

    this.dir.normalize()

    if(dist < minDist[this.type][other.type]) { this.repel(dist, minDist, forces, other) }
    if(dist < radii[this.type][other.type])   { this.att(dist, radii, forces, other) }

    this.acc.add(this.tFrc.div(this.mass))
    this.vel.add(this.acc)

    this.pos.add(this.vel)
    
    if(this.pos.x > this.p.width)   { this.pos.x = 0 }
    if(this.pos.x < 0)              { this.pos.x = this.p.width }
    if(this.pos.y > this.p.height)  { this.pos.y = 0 }
    if(this.pos.y < 0)              { this.pos.y = this.p.height }
    
    this.vel.mult(this.friction)
  }

  draw(color)
  {
    this.p.stroke(color)
    this.p.strokeWeight(this.r)
    this.p.point(this.pos.x, this.pos.y)
  }
}