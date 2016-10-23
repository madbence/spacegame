import createShader from 'gl-shader';
import {mat4} from 'gl-matrix';

function createShipShader(gl) {
  const vertexSource = `
  attribute vec2 pos;
  uniform mat4 model;
  uniform mat4 view;

  void main() {
    gl_Position = view * model * vec4(pos, 0, 1);
  }
  `;

  const fragmentSource = `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
  }
  `;
  const shader = createShader(gl, vertexSource, fragmentSource);
  const verts = new Float32Array([
    -5, -10,
    -5, 10,
    5, 10,
    5, 10,
    5, -10,
    -5, -10,
  ]);

  const buffer = shader.buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

  return shader;
}

function createSpaceShader(gl) {
  const vertexSource = `
attribute vec2 pos;
attribute vec2 tex;

uniform mat4 model;
uniform mat4 view;

varying vec2 v_texcoord;

void main() {
  gl_Position = view * model * vec4(pos * 256., 0, 1);
  v_texcoord = tex;
}
`;
const fragmentSource = `
precision mediump float;
varying vec2 v_texcoord;

uniform sampler2D texture;

void main() {
  gl_FragColor = texture2D(texture, v_texcoord);
  //gl_FragColor = vec4(0, 1, 0, 1); //texture2D(texture, v_texcoord);
}
`;

  const verts = new Float32Array([
    -1, -1, 0, 0,
    -1,  1, 0, 1,
     1,  1, 1, 1,

     1,  1, 1, 1,
     1, -1, 1, 0,
    -1, -1, 0, 0,
  ]);

  const shader = createShader(gl, vertexSource, fragmentSource);
  const buffer = shader.buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

  const texture = shader.texture = gl.createTexture();

  const img = new Image();
  img.addEventListener('load', () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
  });
  img.src = '/space.png';

  return shader;
}

export default class WebGLCanvas {
  constructor(el) {
    const gl = this.gl = el.getContext('webgl', {
      preserveDrawingBuffer: true,
    });
    gl.canvas.width = 800;
    gl.canvas.height = 600;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    this.shaders = {
      ship: createShipShader(gl),
      space: createSpaceShader(gl),
    };
  }

  render(state, player) {
    const gl = this.gl;
    gl.clearColor(0, 1, 0, 0.1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const ship = state.ships.find(ship => ship.owner === player);
    if (ship) {
      let view = mat4.create();
      view = mat4.ortho(view, -400, 400, -300, 300, -10, 10);
      view = mat4.rotateZ(view, view, -ship.ori);
      view = mat4.translate(view, view, [-ship.pos[0], -ship.pos[1], 0]);
      this.shaders.ship.bind();
      this.shaders.ship.uniforms.view = view;
      this.shaders.space.bind();
      this.shaders.space.uniforms.view = view;
    } else {
      this.shaders.ship.uniforms.view = mat4.ortho(mat4.create(), -400, 400, -300, 300, -10, 10);
    }

    this.shaders.space.bind();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.shaders.space.buffer);
    this.shaders.space.attributes.pos.pointer(gl.FLOAT, false, 16, 0);
    this.shaders.space.attributes.tex.pointer(gl.FLOAT, false, 16, 8);

    for (let x = -2; x < 3; x++) {
      for (let y = -2; y < 3; y++) {
        let model = mat4.create();
        if (!ship) continue;
        const ox = Math.floor(ship.pos[0] / 512);
        const oy = Math.floor(ship.pos[1] / 512);
        model = mat4.translate(model, model, [(ox + x) * 512, (oy + y) * 512, 0]);
        this.shaders.space.uniforms.model = model;
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    }

    this.shaders.ship.bind();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.shaders.ship.buffer);
    this.shaders.ship.attributes.pos.pointer();

    for (const ship of state.ships) {
      let model = mat4.create();
      model = mat4.translate(model, model, [ship.pos[0], ship.pos[1], 0]);
      model = mat4.rotateZ(model, model, ship.ori);

      this.shaders.ship.uniforms.model = model;
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
    for (const p of state.projectiles) {
      let model = mat4.create();
      model = mat4.translate(model, model, [p.pos[0], p.pos[1], 0]);
      model = mat4.rotateZ(model, model, p.ori);
      model = mat4.scale(model, model, [0.5, 0.5, 0.5]);

      this.shaders.ship.uniforms.model = model;
      this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
  }
}
