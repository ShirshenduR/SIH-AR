/* KhadanAsAR — A-Frame components: interactive 3D safety props built from
   primitives (no external model files). Each part of the extinguisher — the
   safety pin, the handle and the nozzle — is individually TOUCHABLE, so a
   worker performs P·A·S·S by touching the real 3D object, not a quiz. */

function addChild(parent, tag, attrs) {
  const e = document.createElement(tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  parent.appendChild(e);
  return e;
}
// mark an entity (and thus its mesh) as tappable for a given P.A.S.S. part
function clickable(el, part) {
  el.classList.add('clickable');
  el.setAttribute('data-part', part);
  return el;
}

AFRAME.registerComponent('extinguisher', {
  init: function () {
    const el = this.el;
    // ---- Cylinder body ----
    addChild(el, 'a-cylinder', { radius: 0.34, height: 1.05, position: '0 0.55 0',
      color: '#d32f2f', material: 'metalness: 0.4; roughness: 0.32' });
    addChild(el, 'a-sphere', { radius: 0.34, position: '0 1.06 0', color: '#c62828',
      'theta-length': 90, material: 'metalness: 0.4; roughness: 0.32' });
    addChild(el, 'a-cylinder', { radius: 0.36, height: 0.08, position: '0 0.04 0',
      color: '#6d1616', material: 'metalness: 0.1; roughness: 0.9' }); // rubber foot
    // ---- Label band ----
    addChild(el, 'a-cylinder', { radius: 0.346, height: 0.38, position: '0 0.52 0',
      color: '#fff2cc', material: 'opacity: 0.98; roughness: 0.85' });
    addChild(el, 'a-text', { value: 'FIRE\nCO₂', align: 'center',
      position: '0 0.58 0.355', width: 1.4, color: '#b91c1c', font: 'kelsonsans' });
    addChild(el, 'a-text', { value: 'PULL  AIM  SQUEEZE  SWEEP', align: 'center',
      position: '0 0.4 0.355', width: 1.15, color: '#8a1414' });
    // ---- Neck + gauge ----
    addChild(el, 'a-cylinder', { radius: 0.11, height: 0.22, position: '0 1.28 0',
      color: '#1f2733', material: 'metalness: 0.7; roughness: 0.3' });
    addChild(el, 'a-cylinder', { radius: 0.09, height: 0.05, position: '0 1.3 0.14',
      rotation: '90 0 0', color: '#eef4fb', material: 'roughness: 0.5' });
    addChild(el, 'a-box', { width: 0.012, height: 0.07, depth: 0.012,
      position: '0.02 1.32 0.17', rotation: '0 0 -35', color: '#c62828' }); // needle
    this.buildParts(el);
  },
  buildParts: function (el) {
    // ---- Handle (tappable) ----
    const handle = addChild(el, 'a-entity', { position: '0 1.46 0' });
    clickable(addChild(handle, 'a-box', { width: 0.46, height: 0.055, depth: 0.14,
      color: '#12181f', material: 'metalness: 0.6; roughness: 0.4' }), 'handle');
    clickable(addChild(handle, 'a-box', { width: 0.05, height: 0.14, depth: 0.14,
      position: '-0.2 -0.09 0', color: '#12181f' }), 'handle');
    this.handle = handle;

    // ---- Safety pin: ring + shaft (tappable) ----
    const pin = addChild(el, 'a-entity', { position: '0.26 1.44 0' });
    clickable(addChild(pin, 'a-torus', { radius: 0.07, 'radius-tubular': 0.018,
      rotation: '0 90 0', color: '#ffd21f',
      material: 'metalness: 0.5; roughness: 0.3; emissive: #6b5000' }), 'pin');
    clickable(addChild(pin, 'a-cylinder', { radius: 0.015, height: 0.32,
      position: '-0.17 0 0', rotation: '0 0 90', color: '#e6b800',
      material: 'metalness: 0.5; roughness: 0.3' }), 'pin');
    this.pin = pin;

    // ---- Hose + horn nozzle (tappable) ----
    const nozzle = addChild(el, 'a-entity', { position: '0.28 1.15 0.06' });
    clickable(addChild(nozzle, 'a-cylinder', { radius: 0.03, height: 0.5,
      rotation: '0 0 55', color: '#15181d',
      material: 'metalness: 0.3; roughness: 0.7' }), 'nozzle');
    clickable(addChild(nozzle, 'a-cone', { 'radius-bottom': 0.12, 'radius-top': 0.03,
      height: 0.24, position: '0.22 -0.17 0', rotation: '0 0 120',
      color: '#0d0f12' }), 'nozzle');
    this.nozzle = nozzle;

    // ---- Discharge spray (hidden until Squeeze) ----
    const spray = addChild(el, 'a-entity', { position: '0.52 0.98 0.06', visible: false });
    this.sprayCone = addChild(spray, 'a-cone', { 'radius-bottom': 0.3, 'radius-top': 0.02,
      height: 1.0, position: '0.32 -0.36 0', rotation: '0 0 -118', color: '#e7f5ff',
      material: 'opacity: 0.45; transparent: true; emissive: #cdebff; emissiveIntensity: 0.4' });
    this.spray = spray;

    // ---- Base ring so it reads on any floor ----
    addChild(el, 'a-ring', { 'radius-inner': 0.42, 'radius-outer': 0.5,
      position: '0 0.02 0', rotation: '-90 0 0', color: '#ff8a3d',
      material: 'opacity: 0.9; side: double' });
  },

  pullPin: function () {
    this.pin.setAttribute('animation__pull',
      'property: position; to: 0.9 1.72 0.25; dur: 480; easing: easeOutQuad');
    this.pin.setAttribute('animation__drop',
      'property: position; to: 1.05 0.12 0.35; dur: 720; delay: 480; easing: easeInQuad');
    setTimeout(() => this.pin.setAttribute('visible', false), 1250);
  },
  aimNozzle: function () {
    this.nozzle.setAttribute('animation__aim',
      'property: rotation; to: 0 0 -40; dur: 520; easing: easeOutQuad');
  },
  squeeze: function () {
    this.handle.setAttribute('animation__press',
      'property: position; dir: alternate; loop: 3; dur: 150; to: 0 1.41 0');
    this.spray.setAttribute('visible', true);
    this.sprayCone.setAttribute('animation__pulse',
      'property: scale; dir: alternate; loop: true; dur: 220; to: 1.12 1 1.12');
  },
  sweep: function (done) {
    this.spray.setAttribute('animation__sweep',
      'property: rotation; dir: alternate; loop: 4; dur: 300; to: 0 0 26; easing: easeInOutSine');
    if (typeof done === 'function') setTimeout(done, 1200);
  },
  stopSpray: function () { if (this.spray) this.spray.setAttribute('visible', false); },
  reset: function () {
    this.pin.removeAttribute('animation__pull');
    this.pin.removeAttribute('animation__drop');
    this.pin.setAttribute('position', '0.26 1.44 0');
    this.pin.setAttribute('visible', true);
    this.nozzle.removeAttribute('animation__aim');
    this.nozzle.setAttribute('rotation', '0 0 0');
    this.stopSpray();
    this.spray.removeAttribute('animation__sweep');
    this.spray.setAttribute('rotation', '0 0 0');
  }
});

/* Animated flames. .shrink(f) scales them to fraction f; .extinguish() puts
   them out. An invisible box makes the whole fire easy to tap ("Sweep"). */
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
    const glow = document.createElement('a-light');
    glow.setAttribute('type', 'point');
    glow.setAttribute('color', '#ff6b1a');
    glow.setAttribute('intensity', '1.1');
    glow.setAttribute('distance', '3');
    glow.setAttribute('position', '0 0.3 0');
    el.appendChild(glow);
    this.glow = glow;
    // Invisible tap target over the flames (opacity 0 but still raycastable)
    const hit = addChild(el, 'a-box', { width: 0.95, height: 1.15, depth: 0.7,
      position: '0 0.5 0', material: 'opacity: 0; transparent: true' });
    clickable(hit, 'fire');
    this.hit = hit;
  },
  shrink: function (f) {
    this.flames.forEach(fl => fl.setAttribute('animation__shr',
      `property: scale; to: ${f} ${f} ${f}; dur: 320; easing: easeOutQuad`));
  },
  extinguish: function () {
    if (this.hit) this.hit.setAttribute('visible', false);
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
