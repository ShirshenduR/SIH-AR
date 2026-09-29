/* KhadanAsAR — A-Frame custom components that build the 3D safety props
   from primitives, so nothing depends on external model files loading. */

/* Fire extinguisher, assembled from primitives. */
AFRAME.registerComponent('extinguisher', {
  init: function () {
    const el = this.el;
    const add = (tag, attrs) => {
      const e = document.createElement(tag);
      for (const k in attrs) e.setAttribute(k, attrs[k]);
      el.appendChild(e);
      return e;
    };
    // Body
    add('a-cylinder', { radius: 0.34, height: 1.05, position: '0 0.55 0',
      color: '#d32f2f', 'shadow': 'cast: true',
      material: 'metalness: 0.35; roughness: 0.45' });
    // Rounded top + bottom
    add('a-sphere', { radius: 0.34, position: '0 1.06 0', color: '#c62828',
      'theta-length': 90, material: 'metalness: 0.35; roughness: 0.45' });
    add('a-cylinder', { radius: 0.35, height: 0.06, position: '0 0.03 0', color: '#7f1d1d' });
    // Neck + valve
    add('a-cylinder', { radius: 0.11, height: 0.22, position: '0 1.28 0', color: '#1f2733' });
    add('a-box', { width: 0.42, height: 0.09, depth: 0.16, position: '0 1.42 0',
      color: '#111820' });
    // Pressure gauge
    add('a-cylinder', { radius: 0.09, height: 0.05, position: '0 1.28 0.13',
      rotation: '90 0 0', color: '#e8f0f8' });
    // Hose + horn nozzle
    add('a-cylinder', { radius: 0.03, height: 0.5, position: '0.28 1.15 0.06',
      rotation: '0 0 55', color: '#15181d' });
    add('a-cone', { 'radius-bottom': 0.12, 'radius-top': 0.03, height: 0.24,
      position: '0.5 0.98 0.06', rotation: '0 0 120', color: '#0d0f12' });
    // Label band
    add('a-cylinder', { radius: 0.345, height: 0.34, position: '0 0.5 0',
      color: '#fff2cc', material: 'opacity: 0.95' });
    add('a-text', { value: 'FIRE\nCO2', align: 'center', position: '0 0.5 0.35',
      width: 1.4, color: '#b91c1c', 'font': 'kelsonsans' });
    // Base ring highlight so it reads on any surface
    add('a-ring', { 'radius-inner': 0.42, 'radius-outer': 0.5, position: '0 0.01 0',
      rotation: '-90 0 0', color: '#ff8a3d', material: 'opacity: 0.9; side: double' });
  }
});

/* Animated flames. Call .extinguish() to put them out. */
AFRAME.registerComponent('fire', {
  init: function () {
    const el = this.el;
    this.flames = [];
    const specs = [
      { c: '#ff3b1d', s: 0.32, y: 0.28, x: 0,     z: 0,    d: 900 },
      { c: '#ff7a1a', s: 0.24, y: 0.42, x: 0.14,  z: 0.05, d: 700 },
      { c: '#ffb01f', s: 0.18, y: 0.5,  x: -0.12, z: 0.08, d: 620 },
      { c: '#ffd54f', s: 0.12, y: 0.58, x: 0.02,  z: -0.05, d: 540 }
    ];
    specs.forEach(sp => {
      const f = document.createElement('a-cone');
      f.setAttribute('radius-bottom', sp.s);
      f.setAttribute('radius-top', 0);
      f.setAttribute('height', sp.s * 2.4);
      f.setAttribute('position', `${sp.x} ${sp.y} ${sp.z}`);
      f.setAttribute('color', sp.c);
      f.setAttribute('material', 'emissive: ' + sp.c + '; emissiveIntensity: 0.9; opacity: 0.92; transparent: true');
      f.setAttribute('animation__flick',
        `property: scale; dir: alternate; loop: true; dur: ${sp.d}; to: 1 1.35 1`);
      el.appendChild(f);
      this.flames.push(f);
    });
    // Glow at the base
    const glow = document.createElement('a-light');
    glow.setAttribute('type', 'point');
    glow.setAttribute('color', '#ff6b1a');
    glow.setAttribute('intensity', '1.1');
    glow.setAttribute('distance', '3');
    glow.setAttribute('position', '0 0.3 0');
    el.appendChild(glow);
    this.glow = glow;
  },
  extinguish: function () {
    this.flames.forEach((f, i) => {
      setTimeout(() => {
        f.setAttribute('animation__out',
          'property: scale; to: 0.01 0.01 0.01; dur: 380; easing: easeInQuad');
      }, i * 90);
    });
    if (this.glow) this.glow.setAttribute('animation__dim',
      'property: light.intensity; to: 0; dur: 500');
    setTimeout(() => { this.el.setAttribute('visible', false); }, 900);
  }
});

/* Floating green EXIT arrow that bobs and points the safe way out. */
AFRAME.registerComponent('exit-arrow', {
  init: function () {
    const el = this.el;
    const shaft = document.createElement('a-box');
    shaft.setAttribute('width', 0.5); shaft.setAttribute('height', 0.14);
    shaft.setAttribute('depth', 0.14); shaft.setAttribute('color', '#24c076');
    shaft.setAttribute('material', 'emissive: #24c076; emissiveIntensity: 0.5');
    shaft.setAttribute('position', '-0.15 0 0');
    el.appendChild(shaft);
    const head = document.createElement('a-cone');
    head.setAttribute('radius-bottom', 0.22); head.setAttribute('radius-top', 0);
    head.setAttribute('height', 0.34); head.setAttribute('rotation', '0 0 -90');
    head.setAttribute('position', '0.25 0 0'); head.setAttribute('color', '#24c076');
    head.setAttribute('material', 'emissive: #24c076; emissiveIntensity: 0.5');
    el.appendChild(head);
    const label = document.createElement('a-text');
    label.setAttribute('value', 'EXIT'); label.setAttribute('align', 'center');
    label.setAttribute('position', '-0.05 0.28 0'); label.setAttribute('width', 2.4);
    label.setAttribute('color', '#7CFFB2');
    el.appendChild(label);
    el.setAttribute('animation__bob',
      'property: position; dir: alternate; loop: true; dur: 1200; to: 0 0.15 0; easing: easeInOutSine');
  }
});
