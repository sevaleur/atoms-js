precision highp float;

/* #def MAX_PARTICLE_COUNT 1000
	
uniform vec2 resolution;
uniform int particleCount;
uniform vec3 particles[MAX_PARTICLE_COUNT];
uniform vec3 colors[MAX_PARTICLE_COUNT]; */

void main() {
    /* vec2 st = gl_FragCoord.xy / resolution.xy;  // Warning! This is causing non-uniform scaling.

    float r = 0.0;
    float g = 0.0;
    float b = 0.0;

    float mult = 0.00005;
    
    for (int i = 0; i < MAX_PARTICLE_COUNT; i++) {
      if (i < particleCount) {
        vec3 particle = particles[i];
        vec2 pos = particle.xy;
        float mass = particle.z;
        vec3 color = colors[i];

        r += color.r / distance(st, pos) * mult * mass;
        g += color.g / distance(st, pos) * mult * mass;
        b += color.b / distance(st, pos) * mult * mass;
      }
    } */

    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}