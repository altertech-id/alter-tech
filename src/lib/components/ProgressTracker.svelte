<script>
  import { PROJECT_STAGES } from '$lib/data/mock.js';

  let { currentStage = 'Kualifikasi', progressPercent = 0 } = $props();
  
  const stageIndex = $derived(PROJECT_STAGES.indexOf(currentStage));
</script>

<div class="progress-tracker" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
  <div class="stages">
    {#each PROJECT_STAGES as stage, i}
      <div class="stage" class:completed={i < stageIndex} class:active={i === stageIndex} class:upcoming={i > stageIndex}>
        <div class="stage-dot">
          {#if i < stageIndex}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          {:else}
            <span class="stage-number">{i + 1}</span>
          {/if}
        </div>
        <span class="stage-label">{stage}</span>
        {#if i < PROJECT_STAGES.length - 1}
          <div class="stage-connector" class:filled={i < stageIndex}></div>
        {/if}
      </div>
    {/each}
  </div>
  <div class="progress-bar-track">
    <div class="progress-bar-fill" style="width: {progressPercent}%"></div>
  </div>
  <p class="progress-text">{progressPercent}% selesai</p>
</div>

<style>
  .progress-tracker {
    width: 100%;
  }

  .stages {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: var(--space-4);
  }

  .stage {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    position: relative;
    flex: 1;
  }

  .stage-dot {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    border: 2px solid var(--color-border);
    background: var(--color-surface-base);
    color: var(--color-text-secondary);
    transition: all var(--transition-normal);
    z-index: 1;
  }

  .stage.completed .stage-dot {
    background: var(--color-success);
    border-color: var(--color-success);
    color: white;
  }

  .stage.active .stage-dot {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
    box-shadow: 0 0 0 4px rgba(37, 150, 190, 0.2);
    animation: pulse 2s infinite;
  }

  .stage-number {
    font-size: 11px;
  }

  .stage-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--color-text-secondary);
    text-align: center;
    white-space: nowrap;
  }

  .stage.active .stage-label {
    color: var(--color-primary);
    font-weight: 700;
  }

  .stage.completed .stage-label {
    color: var(--color-success);
  }

  .stage-connector {
    position: absolute;
    top: 15px;
    left: calc(50% + 20px);
    right: calc(-50% + 20px);
    height: 2px;
    background: var(--color-border);
    z-index: 0;
  }

  .stage-connector.filled {
    background: var(--color-success);
  }

  .progress-bar-track {
    width: 100%;
    height: 6px;
    background: var(--color-surface-card);
    border-radius: var(--radius-pill);
    overflow: hidden;
    margin-bottom: var(--space-2);
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-primary), #1ec5a7);
    border-radius: var(--radius-pill);
    transition: width 0.8s ease;
  }

  .progress-text {
    text-align: center;
    font-size: var(--text-caption-size);
    font-weight: var(--text-caption-weight);
    color: var(--color-text-secondary);
  }

  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 4px rgba(37, 150, 190, 0.2); }
    50% { box-shadow: 0 0 0 8px rgba(37, 150, 190, 0.1); }
  }

  @media (max-width: 480px) {
    .stage-label {
      font-size: 9px;
    }
    .stage-dot {
      width: 28px;
      height: 28px;
    }
    .stage-connector {
      top: 13px;
      left: calc(50% + 17px);
      right: calc(-50% + 17px);
    }
  }
</style>
