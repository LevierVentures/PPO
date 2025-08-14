import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  Search, 
  Clock, 
  Users, 
  Building,
  Package,
  FileText,
  ShoppingCart,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { useAppState } from '@/hooks/use-app-state';

export default function GoogleStyleDashboard() {
  const { state } = useAppState();
  const currentUser = state.currentUser;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Mock search data - would come from API
  const searchData = [
    { type: 'vendor', name: 'ACME Corporation', category: 'Office Equipment', status: 'Active' },
    { type: 'vendor', name: 'TechSolutions Inc', category: 'IT Services', status: 'Active' },
    { type: 'product', name: 'Dell Latitude 7420 Laptop', vendor: 'ACME Corporation', price: '$1,299' },
    { type: 'product', name: 'HP LaserJet Pro Printer', vendor: 'Office Depot', price: '$289' },
    { type: 'contract', name: 'Office Supplies Contract 2024', vendor: 'Staples', expires: '2024-12-31' },
    { type: 'requisition', name: 'REQ-2024-0156', department: 'IT', amount: '$22,500' },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = searchData.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        (item.vendor && item.vendor.toLowerCase().includes(query.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const quickActions = [
    { icon: FileText, label: 'New Requisition', href: '/requisitions', color: 'from-blue-500 to-cyan-500' },
    { icon: Users, label: 'Find Vendors', href: '/vendors', color: 'from-purple-500 to-pink-500' },
    { icon: Package, label: 'Browse Products', href: '/catalog', color: 'from-green-500 to-emerald-500' },
    { icon: ShoppingCart, label: 'Track Orders', href: '/purchase-orders', color: 'from-orange-500 to-red-500' },
  ];

  const getSearchIcon = (type: string) => {
    switch (type) {
      case 'vendor': return <Building className="h-4 w-4 text-purple-600" />;
      case 'product': return <Package className="h-4 w-4 text-blue-600" />;
      case 'contract': return <FileText className="h-4 w-4 text-green-600" />;
      case 'requisition': return <ShoppingCart className="h-4 w-4 text-orange-600" />;
      default: return <Search className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Main content area - Google style */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 -mt-16">
        
        {/* Welcome section with Google-style branding */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-light mb-4">
            <span className="text-blue-500">Welcome back,</span>{' '}
            <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent font-medium">
              {currentUser.name}
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-light">
            AI-powered procurement directory at your fingertips
          </p>
        </div>

        {/* Google-style search box */}
        <div className="w-full max-w-2xl mb-12 relative">
          <div className={`relative transition-all duration-300 ${
            isSearchFocused ? 'transform scale-105' : ''
          }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full p-0.5">
              <div className="bg-white dark:bg-gray-800 rounded-full h-full w-full">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search vendors, products, contracts, or anything..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    className="w-full pl-14 pr-6 py-4 text-lg border-none bg-transparent rounded-full h-14 focus:ring-0 focus:outline-none"
                  />
                  {searchQuery && (
                    <Button 
                      size="sm" 
                      className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Search suggestions dropdown */}
          {searchResults.length > 0 && (
            <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto shadow-2xl border-0">
              <CardContent className="p-0">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b last:border-b-0"
                  >
                    {getSearchIcon(result.type)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{result.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {result.type}
                        </Badge>
                        {result.vendor && <span className="text-xs text-gray-500">• {result.vendor}</span>}
                        {result.category && <span className="text-xs text-gray-500">• {result.category}</span>}
                        {result.price && <span className="text-xs font-medium text-green-600">{result.price}</span>}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick action buttons - Google style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mb-16">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="group cursor-pointer">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${action.color} shadow-lg flex items-center justify-center group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300`}>
                  <action.icon className="h-10 w-10 text-white" />
                </div>
                <p className="text-center font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {action.label}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick insights - minimalist cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-blue-600 mb-2">2</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Pending Approvals</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-purple-600 mb-2">23</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Active Contracts</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-green-600 mb-2">$18K</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Cost Savings This Quarter</p>
            </CardContent>
          </Card>
        </div>

        {/* AI assistant prompt */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">Ask AI: "Find office chairs under $300"</span>
            <Zap className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}