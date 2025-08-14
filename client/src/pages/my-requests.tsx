import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Edit,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
import { useAppState } from "@/hooks/use-app-state";

export default function MyRequests() {
  const { state } = useAppState();
  
  const { data: myRequests = [] } = useQuery({
    queryKey: ['/api/requisitions'],
    select: (data: any[]) => data?.filter(item => item.requestorId === state.currentUser.id) || []
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'returned': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'returned': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'draft': return <Edit className="h-4 w-4 text-gray-600" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 space-y-6">
      {/* Simple Header */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Requests</h1>
          <p className="text-gray-600 dark:text-gray-400">Track the status of your purchase requests</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {myRequests.filter(r => r.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Waiting Approval</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {myRequests.filter(r => r.status === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {myRequests.filter(r => r.status === 'returned').length}
            </div>
            <div className="text-sm text-gray-600">Need Updates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {myRequests.filter(r => r.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-600">Drafts</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {myRequests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">No Requests Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't submitted any purchase requests.</p>
              <Link href="/request">
                <Button>Create Your First Request</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          myRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(request.status)}
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {request.title || 'Purchase Request'}
                      </h3>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {request.description || `${request.itemType} purchase from ${request.vendorName}`}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Submitted: {new Date(request.submittedDate).toLocaleDateString()}</span>
                      <span>Amount: ${request.totalAmount?.toLocaleString() || '0'}</span>
                      {request.department && <span>Dept: {request.department}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    {(request.status === 'draft' || request.status === 'returned') && (
                      <Button size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
                
                {request.status === 'returned' && request.feedback && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border-l-4 border-red-500">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      <strong>Feedback:</strong> {request.feedback}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}