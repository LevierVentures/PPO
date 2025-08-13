import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye, X, Check } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import WorkflowModal from "@/components/workflow/workflow-modal";

export default function Approvals() {
  const [selectedRequisitionId, setSelectedRequisitionId] = useState<string | null>(null);
  const [workflowModalOpen, setWorkflowModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requisitions = [], isLoading } = useQuery({
    queryKey: ["/api/requisitions"],
    queryFn: api.requisitions.getAll,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.requisitions.update(id, { status: "approved", approvedAt: new Date() }),
    onSuccess: () => {
      toast({ title: "Success", description: "Request approved successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/requisitions"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to approve request", variant: "destructive" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => api.requisitions.update(id, { status: "rejected" }),
    onSuccess: () => {
      toast({ title: "Success", description: "Request rejected successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/requisitions"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to reject request", variant: "destructive" });
    },
  });

  const pendingRequisitions = requisitions.filter(req => req.status === "pending");

  const handleShowWorkflow = (requestId: string) => {
    setSelectedRequisitionId(requestId);
    setWorkflowModalOpen(true);
  };

  const handleApprove = (id: string) => {
    if (confirm("Are you sure you want to approve this request?")) {
      approveMutation.mutate(id);
    }
  };

  const handleReject = (id: string) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
      rejectMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading approvals...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Pending Approvals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequisitions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending approvals found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Requestor</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequisitions.map((requisition) => (
                  <TableRow key={requisition.id}>
                    <TableCell className="font-medium">{requisition.requestId}</TableCell>
                    <TableCell>{requisition.requestorId}</TableCell>
                    <TableCell>{requisition.department}</TableCell>
                    <TableCell>
                      ${parseFloat(requisition.totalAmount || "0").toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(requisition.submittedAt!).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="status-pending">
                        {requisition.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShowWorkflow(requisition.requestId)}
                        >
                          <Eye className="h-4 w-4" />
                          Workflow
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleApprove(requisition.id)}
                          disabled={approveMutation.isPending}
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleReject(requisition.id)}
                          disabled={rejectMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <WorkflowModal
        requisitionId={selectedRequisitionId}
        open={workflowModalOpen}
        onOpenChange={setWorkflowModalOpen}
      />
    </div>
  );
}
