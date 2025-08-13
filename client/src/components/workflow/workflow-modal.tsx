import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Check, Clock } from "lucide-react";
import { api } from "@/lib/api";
import type { WorkflowStep } from "@shared/schema";

interface WorkflowModalProps {
  requisitionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WorkflowModal({ requisitionId, open, onOpenChange }: WorkflowModalProps) {
  const { data: workflowSteps = [], isLoading } = useQuery({
    queryKey: ["/api/requisitions", requisitionId, "workflow"],
    queryFn: () => requisitionId ? api.requisitions.getWorkflow(requisitionId) : Promise.resolve([]),
    enabled: !!requisitionId && open,
  });

  if (!requisitionId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Workflow for {requisitionId}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading workflow...</div>
          ) : workflowSteps.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No workflow steps found
            </div>
          ) : (
            <div className="space-y-0 border rounded-lg overflow-hidden">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`workflow-step ${step.status === "completed" ? "completed" : ""}`}
                >
                  <div className="workflow-icon">
                    {step.status === "completed" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{step.stepName}</span>
                      <Badge
                        variant={step.status === "completed" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {step.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Assigned to: {step.assigneeId}
                    </div>
                    {step.completedAt && (
                      <div className="text-xs text-muted-foreground">
                        Completed: {new Date(step.completedAt).toLocaleDateString()}
                      </div>
                    )}
                    {step.notes && (
                      <div className="text-sm mt-1 text-muted-foreground">
                        Notes: {step.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
