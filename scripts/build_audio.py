"""Builds narrated section audio: the voice recording mixed over an original backing track.

The music is composed and synthesised here (drums, bass, plucked chords, bells), so
it's original to this project and free of any licence. Levels are set so the music
sits well under the voice: fuller in the intro and outro, ducked while someone speaks.

Usage (from the culture-code folder):  python scripts/build_audio.py
Needs: pip install numpy scipy soundfile lameenc
"""
from pathlib import Path

import lameenc
import numpy as np
import soundfile as sf
from scipy import signal

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT.parent
OUT = ROOT / "public" / "audio"
SR = 44100

# Narrations to build: source recording -> output file.
NARRATIONS = {"Evolution.mp3": "evolution.mp3"}

# Arrangement
BPM = 112
BEAT = 60 / BPM
BAR = BEAT * 4
LEAD_IN = 2 * BAR  # music alone before the voice starts
TAIL = 2 * BAR  # music after the voice ends
CHORDS = [  # C, G, Am, F: (voicing, bass root) as MIDI notes
    ([60, 64, 67, 72], 36),
    ([59, 62, 67, 74], 43),
    ([57, 60, 64, 69], 45),
    ([57, 60, 65, 72], 41),
]
BELL_RIFF = [72, 76, 79, 84, 79, 76, 74, 79]  # eighth notes, intro and outro only

# Levels (dBFS RMS)
VOICE_TARGET = -18.0
MUSIC_FULL = -16.0  # intro and outro
MUSIC_UNDER_VOICE = -27.0  # while the voice is talking: about 10 dB under it
DUCK_EXTRA = -2.0  # extra dip during words, released in gaps
PEAK_CEILING = -1.0
SPEECH_LOUDNESS = -15.5  # final level of the spoken section
MUSIC_NORM = -18.0  # the composed bed is normalised to this before levels are applied

rng = np.random.default_rng(2017)


def hz(note: float) -> float:
    return 440.0 * 2 ** ((note - 69) / 12)


def db(x: float) -> float:
    return 10 ** (x / 20)


def rms_db(x: np.ndarray) -> float:
    return 20 * np.log10(np.sqrt(np.mean(np.square(x))) + 1e-12)


def env(n: int, attack: float, decay: float) -> np.ndarray:
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-np.maximum(t - attack, 0) / decay)


def lowpass(x: np.ndarray, cutoff: float, order: int = 2) -> np.ndarray:
    return signal.sosfilt(signal.butter(order, cutoff, "low", fs=SR, output="sos"), x)


def highpass(x: np.ndarray, cutoff: float, order: int = 2) -> np.ndarray:
    return signal.sosfilt(signal.butter(order, cutoff, "high", fs=SR, output="sos"), x)


def bandpass(x: np.ndarray, lo: float, hi: float) -> np.ndarray:
    return signal.sosfilt(signal.butter(2, [lo, hi], "band", fs=SR, output="sos"), x)


# ---------- Instruments ----------

def kick(length: float = 0.45) -> np.ndarray:
    n = int(length * SR)
    t = np.arange(n) / SR
    freq = 48 + 110 * np.exp(-t / 0.035)
    body = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t / 0.22)
    click = rng.standard_normal(n) * np.exp(-t / 0.004) * 0.25
    return body + highpass(click, 2000)


def clap(length: float = 0.3) -> np.ndarray:
    n = int(length * SR)
    t = np.arange(n) / SR
    noise = bandpass(rng.standard_normal(n), 900, 4500)
    shape = np.exp(-t / 0.09)
    for offset in (0.0, 0.011, 0.022):  # three quick hands
        shape += 0.6 * np.exp(-np.maximum(t - offset, 0) / 0.006) * (t >= offset)
    return noise * shape * 0.55


def hat(length: float, decay: float) -> np.ndarray:
    n = int(length * SR)
    return highpass(rng.standard_normal(n), 7000, 4) * env(n, 0.001, decay) * 0.5


def pluck(notes: list[int], length: float) -> np.ndarray:
    n = int(length * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for note in notes:
        for detune in (-0.07, 0.0, 0.07):  # semitones
            out += signal.sawtooth(2 * np.pi * hz(note + detune) * t + rng.uniform(0, 6.28)) / 3
    out = lowpass(out, 2600) * env(n, 0.004, 0.16)
    return out / len(notes)


def pad(notes: list[int], length: float) -> np.ndarray:
    n = int(length * SR)
    t = np.arange(n) / SR
    out = sum(signal.sawtooth(2 * np.pi * hz(m) * t, 0.5) for m in notes) / len(notes)
    swell = np.clip(t / 0.35, 0, 1) * np.clip((length - t) / 0.3, 0, 1)
    return lowpass(out, 1200) * swell


def bass(note: int, length: float) -> np.ndarray:
    n = int(length * SR)
    t = np.arange(n) / SR
    f = hz(note)
    tone = np.sin(2 * np.pi * f * t) + 0.35 * signal.square(2 * np.pi * f * t)
    return lowpass(tone, 420) * env(n, 0.005, 0.18)


def bell(note: int, length: float = 1.4) -> np.ndarray:
    n = int(length * SR)
    t = np.arange(n) / SR
    f = hz(note)
    tone = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t / 0.25)
    return tone * env(n, 0.002, 0.55) * 0.5


# ---------- Arrangement ----------

def place(track: np.ndarray, sound: np.ndarray, at: float, gain: float = 1.0) -> None:
    i = int(at * SR)
    if i >= len(track):
        return
    end = min(len(track), i + len(sound))
    track[i:end] += sound[: end - i] * gain


def compose(n: int) -> np.ndarray:
    """An upbeat pop/house bed: four-bar loop of C G Am F at 112 BPM, n samples long."""
    length = n / SR
    bars = int(np.ceil(length / BAR))
    drums, keys, low, pads, bells = (np.zeros(n) for _ in range(5))
    k, c = kick(), clap()
    closed, open_hat = hat(0.08, 0.025), hat(0.25, 0.09)
    pump = np.ones(n)  # sidechain-style pump from the kick, for bounce

    for bar in range(bars):
        start = bar * BAR
        chord, root = CHORDS[bar % len(CHORDS)]
        intro = bar < 2
        place(pads, pad(chord, BAR), start, 0.5)
        for beat in range(4):
            t = start + beat * BEAT
            if not intro:
                place(drums, k, t, 1.0)
                i = int(t * SR)
                dip = 1 - 0.45 * np.exp(-np.arange(int(BEAT * SR)) / (0.09 * SR))
                pump[i : i + len(dip)] = dip[: max(0, min(len(dip), n - i))]
                if beat in (1, 3):
                    place(drums, c, t, 0.8)
                place(low, bass(root, BEAT * 0.45), t + BEAT / 2, 0.9)  # offbeat bass
            place(drums, closed, t, 0.35)
            place(drums, open_hat if not intro else closed, t + BEAT / 2, 0.45)
            for sixteenth in (0.25, 0.75):
                place(drums, closed, t + sixteenth * BEAT, 0.12)
            place(keys, pluck(chord, BEAT * 0.6), t + BEAT / 2, 0.9)  # offbeat stabs
        if intro or bar >= bars - 2:
            for j, note in enumerate(BELL_RIFF):
                place(bells, bell(note), start + j * BEAT / 2, 0.55)

    keys *= pump
    low *= pump
    pads *= pump
    # Stereo: keys and bells spread with a short delay, hats slightly right.
    delay = int(BEAT * 0.75 * SR)
    keys_l = keys + 0.25 * np.concatenate([np.zeros(delay), keys[:-delay]])
    keys_r = keys + 0.25 * np.concatenate([np.zeros(int(delay * 1.5)), keys[: -int(delay * 1.5)]])
    left = 0.95 * drums + low + 0.8 * keys_l + 0.35 * pads + 0.9 * bells
    right = 1.05 * drums + low + 0.8 * keys_r + 0.35 * pads + 0.6 * bells
    return np.stack([left, right], axis=1)


# ---------- Voice ----------

def follow(x: np.ndarray, attack: float, release: float) -> np.ndarray:
    """Peak envelope follower."""
    a = np.exp(-1 / (attack * SR))
    r = np.exp(-1 / (release * SR))
    level = np.abs(x)
    out = np.empty_like(level)
    e = 0.0
    for i, v in enumerate(level):
        coeff = a if v > e else r
        e = coeff * e + (1 - coeff) * v
        out[i] = e
    return out


def process_voice(path: Path) -> np.ndarray:
    data, sr = sf.read(path, always_2d=True)
    assert sr == SR, f"expected {SR} Hz, got {sr}"
    voice = highpass(data.mean(axis=1), 80)
    # Gentle 3:1 compression above -26 dBFS evens out the reading.
    level = follow(voice, 0.005, 0.12)
    over = np.maximum(20 * np.log10(level + 1e-9) + 26, 0)
    voice = voice * db(-over * (1 - 1 / 3))
    frames = voice[: len(voice) // 4410 * 4410].reshape(-1, 4410)
    loud = frames[np.sqrt((frames**2).mean(axis=1)) > db(-50)]
    voice *= db(VOICE_TARGET - rms_db(loud))
    return voice


def music_level(voice: np.ndarray, total: int, offset: int) -> np.ndarray:
    """Gain curve for the music: full in the intro and outro, low under the voice."""
    t = np.arange(total) / SR
    v_start = offset / SR
    v_end = (offset + len(voice)) / SR
    curve = np.full(total, MUSIC_FULL)
    ramp = 1.2
    down = np.clip((t - (v_start - ramp)) / ramp, 0, 1)
    up = np.clip((t - v_end) / ramp, 0, 1)
    curve = MUSIC_FULL + (MUSIC_UNDER_VOICE - MUSIC_FULL) * down * (1 - up)
    # Extra dip while words are being spoken.
    talk = np.zeros(total)
    talk[offset : offset + len(voice)] = follow(voice, 0.05, 0.45)
    talk = np.clip(talk / db(-30), 0, 1)
    curve += DUCK_EXTRA * talk
    gain = db(curve - MUSIC_NORM)
    fade = np.clip((total / SR - t) / (BAR * 0.9), 0, 1)  # fade out across the last bar
    return gain * fade


def soft_limit(x: np.ndarray, knee: float = 0.75) -> np.ndarray:
    """Leaves everything under the knee alone and rounds peaks off smoothly towards 1.0."""
    mag = np.abs(x)
    over = mag > knee
    shaped = mag.copy()
    shaped[over] = knee + (1 - knee) * np.tanh((mag[over] - knee) / (1 - knee))
    return np.sign(x) * shaped


def build(source: Path, target: Path) -> None:
    voice = process_voice(source)
    offset = int(LEAD_IN * SR)
    total = offset + len(voice) + int(TAIL * SR)
    music = compose(total)
    music *= db(MUSIC_NORM - rms_db(music))  # normalise before applying the level curve
    gain = music_level(voice, total, offset)
    mix = music * gain[:, None]
    mix[offset : offset + len(voice)] += voice[:, None]

    under = slice(offset + SR, offset + len(voice) - SR)
    intro = slice(int(BAR * SR), offset - SR)
    print(f"  voice {rms_db(voice):.1f} dBFS | music under voice {rms_db(music[under] * gain[under, None]):.1f} dBFS"
          f" | music in intro {rms_db(music[intro] * gain[intro, None]):.1f} dBFS (before final peak normalise)")

    # Bring the voice up to a normal web listening level, catching rare peaks with a soft limiter.
    mix *= db(SPEECH_LOUDNESS - rms_db(mix[offset : offset + len(voice)]))
    mix = soft_limit(mix) * db(PEAK_CEILING)
    pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)

    encoder = lameenc.Encoder()
    encoder.set_bit_rate(160)
    encoder.set_in_sample_rate(SR)
    encoder.set_channels(2)
    encoder.set_quality(2)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(encoder.encode(pcm.tobytes()) + encoder.flush())
    print(f"{target.relative_to(ROOT)}  {total / SR:.1f}s  {target.stat().st_size // 1024} KB")


if __name__ == "__main__":
    for source, name in NARRATIONS.items():
        build(SRC / source, OUT / name)
