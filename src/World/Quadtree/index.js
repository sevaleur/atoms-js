export class Point 
{
  constructor(x, y, userData)
  {
    this.x = x 
    this.y = y 
    this.userData = userData
  }
}

export class Circle
{
  constructor(x, y, r)
  {
    this.x = x; 
    this.y = y; 
    this.r = r; 
    this.rSqr = this.r*this.r 
  }

  contains(point)
  {
    let d = Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2)
    return d <= this.rSqr
  }

  intersects(range)
  {
    let xDist = Math.abs(range.x - this.x)
    let yDist = Math.abs(range.y - this.y)

    let r = this.r 
    let w = range.w/2
    let h = range.h/2 

    let edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2)

    if(xDist > (r + w) || yDist > (r+h))
      return false 

    if(xDist <= w || yDist <= h)
      return true 

    return edges <= this.rSqr
  }
}

export class AABB
{
  constructor(x, y, w, h)
  {
    this.x = x
    this.y = y
    this.w = w 
    this.h = h
  }

  contains(point)
  {
    return (point.x >= this.x - this.w &&
            point.x <= this.x + this.w && 
            point.y >= this.y - this.h && 
            point.y <= this.y + this.h )
  }

  intersects(range)
  {
    return !(range.x - range.w > this.x + this.w || 
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h )
  }
}

export class QuadTree 
{
  constructor(boundary, n = 4)
  {
    if(!boundary)
    {
      throw TypeError('boundary is null or undefined')
    }
    if(!(boundary instanceof AABB))
    {
      throw TypeError('boundary should be of class AABB')
    }
    if(typeof n !== 'number')
    {
      throw TypeError(`capacity should be a number but is of type ${typeof n}`)
    }
    if(n < 1)
    {
      throw RangeError('capacity must be greater than 0')
    }

    this.boundary = boundary
    this.capacity = n
    this.points = []
    this.divided = false
  }

  subdivide()
  {
    let x = this.boundary.x 
    let y = this.boundary.y 
    let w = this.boundary.w 
    let h = this.boundary.h 

    let ne = new AABB(x + w/2, y - h/2, w/2, h/2)
    let nw = new AABB(x - w/2, y - h/2, w/2, h/2)
    let se = new AABB(x + w/2, y + h/2, w/2, h/2)
    let sw = new AABB(x - w/2, y + h/2, w/2, h/2)

    this.northeast = new QuadTree(ne, this.capacity)
    this.northwest = new QuadTree(nw, this.capacity)
    this.southeast = new QuadTree(se, this.capacity)
    this.southwest = new QuadTree(sw, this.capacity)

    this.divided = true
  }

  insert(point)
  {
    if(!this.boundary.contains(point))
      return false 

    if(!this.divided)
    {
      if(this.points.length < this.capacity)
      {
        this.points.push(point)
        return true 
      }

      this.subdivide()
    }

    return (
      this.northeast.insert(point) ||
      this.northwest.insert(point) ||
      this.southeast.insert(point) ||
      this.southwest.insert(point) 
    )
  }

  query(range, found)
  {
    if(!found)
    {
      found = []
    }

    if(!range.intersects(this.boundary))
    {
      return found 
    }

    if(this.divided)
    {
      this.northeast.query(range, found)
      this.northwest.query(range, found)
      this.southeast.query(range, found)
      this.southwest.query(range, found)

      return found
    }

    for(const p of this.points)
    {
      if(range.contains(p))
      {
        found.push(p)
      }
    }

    return found
  }

  draw(p)
  {
    p.stroke(255)
    p.strokeWeight(1)
    p.noFill()
    p.rectMode(p.CENTER)
    p.rect(this.boundary.x, this.boundary.y, this.boundary.w*2, this.boundary.h*2)
    if(this.divided)
    {
      this.northeast.draw(p)
      this.northwest.draw(p)
      this.southeast.draw(p)
      this.southwest.draw(p)
    }
  }
}