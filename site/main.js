
function r(a, b) {
  var r = new Uint32Array(1);
  window.crypto.getRandomValues(r);
  return r % (b - a) + a;
}

const lc = 'abcdefghijklmnopqrstuvwxyz';
const uc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const dg = '0123456789'

function pick(arr) {
  var r = new Uint32Array(1);
  window.crypto.getRandomValues(r);
  return arr[r[0] % arr.length];
}

function rLC() { return pick(lc); }
function rUC() { return pick(uc); }
function rDG() { return pick(dg); }

function genPassword() {
  var xs = [ ];

  for (var i=0; i<14; i++) { xs.push(rLC()); }
  for (var i=0; i<14; i++) { xs.push(rUC()); }
  for (var i=0; i<6; i++) { xs.push(rDG()); }

  var ys = [ ];
  while (xs.length > 0) {
    var i = r(0, xs.length);
    var x = xs[i];
    xs.splice(i, 1);
    ys.push(x);
  }

  var res = '';
  for (y of ys) {
    res += y;
  }

  return res;
}

document.addEventListener("DOMContentLoaded", (_) => { 
  const pwField = document.getElementById('password-field');
  const plainTextField = document.getElementById('plain-text-pw-field');
  const domainField = document.getElementById('domain-field');
  
  if (pwField.value == '') {
    const pw = genPassword();
    plainTextField.textContent = pw;
    pwField.value = pw;
  }
  
  document.getElementById('copy-pw-button').addEventListener("click", (_) => {
    const range = document.createRange();
    range.selectNode(document.getElementById('plain-text-pw-field'));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    
    document.execCommand('copy');
    
    document.getElementById('copy-acknowledgement').classList.add('activated');
  });
  
  document.getElementById('password-field').addEventListener('input', (_) => {
    document.getElementById('plain-text-pw-field').textContent = document.getElementById('password-field').value;
    document.getElementById('copy-acknowledgement').classList.remove('activated');
  });
  
  document.getElementById('main-form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    return false;
  });
  
  document.getElementById('shuffle-button').addEventListener('click', (ev) => {
    ev.preventDefault();
    
    const pw = genPassword();
    plainTextField.textContent = pw;
    pwField.value = pw;
    
    return false;
  });
  
  const currentHost = window.location.hostname;
  const suffix = '.password-saver.ellbur.com';
  if (currentHost.endsWith(suffix)) {
    const currentSub = currentHost.substring(0, currentHost.length - suffix.length);
    domainField.value = currentSub;
  }
  
  const changeDomainForm = document.getElementById('domain-form');
  changeDomainForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const sub = domainField.value;
    const cleanSub = sub.replace('.', '');
    window.location = 'https://' + cleanSub + '.password-saver.ellbur.com';
    return false;
  })
});

