import type { Start, Stop } from '$lib/components/emitter/types';

export class ParticleManager {
	#groupIds = ['', '', '', '', ''];
	startParticles: Start | undefined;
	stopParticles: Stop | undefined;
	start(cardId: string, burst: boolean, hue: number, x: number, z: number) {
		if (!this.startParticles) return;

		const unusedGroupIndex = this.#groupIds.findIndex((id) => id === '');
		if (unusedGroupIndex < 0) return;

		this.#groupIds[unusedGroupIndex] = cardId;
		this.startParticles(unusedGroupIndex, burst, hue, x, z);
	}
	stop(cardId: string) {
		if (!this.stopParticles) return;

		const groupIndex = this.#groupIds.findIndex((id) => id === cardId);
		if (groupIndex < 0) return;
		this.stopParticles(groupIndex);
	}
	groupNoLongerInUse(group: number) {
		this.#groupIds[group] = '';
	}
	clearAll() {
		if (!this.stopParticles) return;

		this.#groupIds = ['', '', '', '', ''];
		for (let i = 0; i < 5; i++) {
			this.stopParticles(i);
		}
	}
}
