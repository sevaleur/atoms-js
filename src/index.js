import p5 from "p5"
import World from './World'

new p5((p) => 
{
  let w, isRunning

  p.setup = () => 
  {
    p.createCanvas(p.windowWidth, p.windowHeight)

    w = new World(
      p, 
      6,
    )

    w.setup()
    w.fill(p.createVector(p.windowWidth/2, p.windowHeight/2), 2000, 450)
  }

  p.keyPressed = () => 
  {
    switch(p.keyCode)
    {
      case p.SHIFT: 
        w.setParams()
        break 
      case p.ESCAPE: 
        isRunning = false 
        break 
      case p.ENTER: 
        isRunning = true
        break 
      default: 
        break 
    }
  }

  p.draw = () => 
  {
    w.draw(isRunning)
  }
})
