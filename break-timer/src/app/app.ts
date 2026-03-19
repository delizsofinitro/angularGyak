import { Component, signal, computed, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnDestroy {
  readonly breakOptions = [5, 10, 15, 20, 30];

  readonly remainingSeconds = signal(0);
  readonly isRunning = signal(false);
  readonly selectedMinutes = signal(10);

  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly minutes = computed(() => Math.floor(this.remainingSeconds() / 60));
  readonly seconds = computed(() => this.remainingSeconds() % 60);

  readonly display = computed(() => {
    const m = String(this.minutes()).padStart(2, '0');
    const s = String(this.seconds()).padStart(2, '0');
    return `${m}:${s}`;
  });

  readonly progress = computed(() => {
    const total = this.selectedMinutes() * 60;
    if (total === 0) return 0;
    return ((total - this.remainingSeconds()) / total) * 100;
  });

  readonly isFinished = computed(
    () => !this.isRunning() && this.remainingSeconds() === 0 && this.selectedMinutes() > 0
  );

  startTimer(): void {
    this.stopTimer();
    this.remainingSeconds.set(this.selectedMinutes() * 60);
    this.isRunning.set(true);

    this.intervalId = setInterval(() => {
      const current = this.remainingSeconds();
      if (current <= 1) {
        this.remainingSeconds.set(0);
        this.isRunning.set(false);
        this.clearInterval();
      } else {
        this.remainingSeconds.set(current - 1);
      }
    }, 1000);
  }

  stopTimer(): void {
    this.isRunning.set(false);
    this.remainingSeconds.set(0);
    this.clearInterval();
  }

  selectDuration(minutes: number): void {
    if (this.isRunning()) return;
    this.selectedMinutes.set(minutes);
  }

  private clearInterval(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  ngOnDestroy(): void {
    this.clearInterval();
  }
}
