// Simple notification + sound helpers

export const playChime = (tones = [880], duration = 0.12) => {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    tones.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      o.connect(g);
      g.connect(ctx.destination);
      const start = now + i * (duration + 0.04);
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(0.3, start + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      o.start(start);
      o.stop(start + duration + 0.02);
    });
  } catch (_) {}
};

export const requestNotifyPermission = async () => {
  if (typeof Notification === 'undefined') return 'denied';
  try {
    const p = await Notification.requestPermission();
    return p;
  } catch (_) {
    return 'denied';
  }
};

export const notify = async (title, body, { sound = true } = {}) => {
  if (typeof Notification === 'undefined') {
    if (sound) playChime([880, 980], 0.1);
    alert(`${title}\n${body || ''}`);
    return;
  }
  let perm = Notification.permission;
  if (perm !== 'granted') {
    try {
      perm = await Notification.requestPermission();
    } catch (_) {}
  }
  if (perm === 'granted') {
    new Notification(title, { body });
  }
  if (sound) playChime([880, 980], 0.1);
};