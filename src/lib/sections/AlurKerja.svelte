<script>
  import { WORKFLOW_STEPS } from '$lib/data/mock.js';
</script>

<section id="alur-kerja" class="section section-dark">
  <div class="container">
    <div class="section-header reveal">
      <h2 class="text-h1">Alur Kerja Kami</h2>
      <p class="section-subtitle">Dari ngobrol sampai go live — prosesnya jelas, cepat, dan transparan.</p>
      <div class="timeline-badge">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 4v4l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Maks. 7–10 hari kerja dari deal hingga go live
      </div>
    </div>

    <div class="timeline">
      {#each WORKFLOW_STEPS as step, i}
        <div class="timeline-step reveal" style="transition-delay: {i * 150}ms">
          <div class="step-marker">
            <div class="step-number">{i + 1}</div>
            {#if i < WORKFLOW_STEPS.length - 1}
              <div class="step-line"></div>
            {/if}
          </div>
          <div class="step-content">
            <span class="step-stage">{step.stage}</span>
            <h3 class="step-title">{step.title}</h3>
            <p class="step-desc">{step.description}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .section-dark {
    background: var(--color-accent);
    color: var(--color-text-inverse);
  }

  .section-header {
    text-align: center;
    max-width: 600px;
    margin-inline: auto;
    margin-bottom: var(--space-6);
  }

  .section-subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: var(--text-body-lg-size);
    margin-top: var(--space-3);
  }

  .timeline-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: 8px 16px;
    background: rgba(37, 150, 190, 0.15);
    color: var(--color-primary);
    border: 1px solid rgba(37, 150, 190, 0.3);
    border-radius: var(--radius-pill);
    font-size: 13px;
    font-weight: 600;
    margin-top: var(--space-4);
  }

  .timeline {
    max-width: 600px;
    margin-inline: auto;
    display: flex;
    flex-direction: column;
  }

  .timeline-step {
    display: flex;
    gap: var(--space-4);
    position: relative;
  }

  .step-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }

  .step-number {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 16px;
    z-index: 1;
    box-shadow: 0 0 0 4px rgba(37, 150, 190, 0.2);
  }

  .step-line {
    width: 2px;
    flex: 1;
    min-height: 40px;
    background: rgba(37, 150, 190, 0.3);
  }

  .step-content {
    padding-bottom: var(--space-6);
    padding-top: var(--space-1);
  }

  .step-stage {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-primary);
    margin-bottom: var(--space-1);
  }

  .step-title {
    font-size: var(--text-h3-size);
    font-weight: 700;
    margin-bottom: var(--space-2);
  }

  .step-desc {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
  }
</style>
