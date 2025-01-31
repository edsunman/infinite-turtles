import type { Audio } from 'three';

export class AudioPlayer {
	volume = 1;
	threeAudio: Audio | undefined;
	sounds: { name: string; duration: number }[] = [];
	play(name: string, { randomPitch = false } = {}) {
		const sound = this.sounds.find((sound) => sound.name === name);
		if (!this.threeAudio || !sound) return;

		const source = this.threeAudio.context.createBufferSource();
		const gainNode = this.threeAudio.context.createGain();

		source.buffer = this.threeAudio.buffer;
		source.connect(gainNode);
		gainNode.gain.value = this.volume;
		gainNode.connect(this.threeAudio.context.destination);

		let offset = 0;
		for (const sound of this.sounds) {
			if (sound.name === name) break;
			offset += sound.duration;
		}

		if (randomPitch) source.detune.value = Math.floor(Math.random() * 500);
		source.start(this.threeAudio.context.currentTime, offset, sound.duration);
	}
}
