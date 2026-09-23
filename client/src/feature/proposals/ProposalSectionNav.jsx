import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export default function ProposalSectionNav({
  steps,
  currentStep,
  progress,
  studyTitle,
  onSelectStep,
}) {
  return (
    <div className="proposal-nav">
      <div className="proposal-nav__summary">
        {studyTitle ? (
          <p className="proposal-nav__study-title" title={studyTitle}>
            {studyTitle}
          </p>
        ) : (
          <p className="proposal-nav__study-placeholder">Untitled proposal</p>
        )}
        <div className="proposal-nav__readiness">
          <span className="proposal-nav__readiness-label">{progress.readinessLabel}</span>
          <span className="proposal-nav__readiness-meta">
            {progress.sectionsComplete} of {progress.sectionsTotal} sections ready
          </span>
        </div>
        <Progress value={progress.percent} className="proposal-nav__progress" />
      </div>

      <nav className="proposal-nav__list" aria-label="Proposal sections">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = progress.sectionComplete[step.sectionId];

          return (
            <button
              key={step.sectionId}
              type="button"
              onClick={() => onSelectStep(index)}
              aria-current={isActive ? "step" : undefined}
              className={cn(
                "proposal-nav__item",
                isActive && "proposal-nav__item--active",
                isComplete && !isActive && "proposal-nav__item--complete"
              )}
            >
              <span className="proposal-nav__marker" aria-hidden="true">
                {isComplete ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                ) : (
                  <Circle className="h-3 w-3" strokeWidth={isActive ? 2.5 : 1.75} />
                )}
              </span>
              <span className="proposal-nav__item-body">
                <span className="proposal-nav__item-title">{step.short}</span>
                <span className="proposal-nav__item-desc">{step.description}</span>
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
