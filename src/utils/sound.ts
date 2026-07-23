// Phát 2 tiếng "beep" ngắn khi có cảnh báo Critical — tự tạo bằng Web Audio
// API, không cần file âm thanh (tránh phải quản lý asset + license).
export function playCriticalAlertSound() {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();

    const beepAt = (startOffset: number) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 880;

      const start = ctx.currentTime + startOffset;
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.25);

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.25);
    };

    beepAt(0);
    beepAt(0.3);
  } catch (err) {
    console.error("Không phát được âm thanh cảnh báo:", err);
  }
}
