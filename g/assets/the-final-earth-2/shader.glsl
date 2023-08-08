precision mediump float;

varying vec2 vTextureCoord;//The coordinates of the current pixel
uniform sampler2D uSampler;//The image data

void main(void) {
   gl_FragColor = 0.5 * (texture2D(uSampler, vTextureCoord) + texture2D(uSampler, vTextureCoord + vec2(1/2048, 0.0)));
}
