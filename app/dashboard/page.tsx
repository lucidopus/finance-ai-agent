'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Customer, CustomerStatus } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

type DashboardCustomer = Omit<Customer, '_id'> & { _id: string };

const statusColors: Record<CustomerStatus, string> = {
  pending_documents: 'bg-yellow-500/20 text-yellow-200 ring-1 ring-yellow-500/40',
  processing: 'bg-blue-500/20 text-blue-200 ring-1 ring-blue-500/40',
  ready_for_review: 'bg-emerald-500/20 text-emerald-100 ring-1 ring-emerald-500/40',
  escalated: 'bg-purple-500/20 text-purple-100 ring-1 ring-purple-500/40',
  awaiting_additional_docs: 'bg-orange-500/20 text-orange-100 ring-1 ring-orange-500/40',
  approved: 'bg-green-500/20 text-green-100 ring-1 ring-green-500/40',
  rejected: 'bg-red-500/20 text-red-100 ring-1 ring-red-500/40',
};

const statusLabels: Record<CustomerStatus, string> = {
  pending_documents: 'Pending Documents',
  processing: 'Processing',
  ready_for_review: 'Ready for Review',
  escalated: 'Escalated',
  awaiting_additional_docs: 'Awaiting Docs',
  approved: 'Approved',
  rejected: 'Rejected',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [customers, setCustomers] = useState<DashboardCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const analystEmail = user?.email;

  const loadCustomers = useCallback(async () => {
    if (!analystEmail) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/customers?analyst=${encodeURIComponent(analystEmail)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }

      const data: { customers: DashboardCustomer[] } = await response.json();
      setCustomers(data.customers ?? []);
    } catch (fetchError) {
      console.error('Error fetching customers:', fetchError);
      setError('Unable to load customer queue. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [analystEmail]);

  useEffect(() => {
    if (!analystEmail) {
      return;
    }
    loadCustomers();
  }, [analystEmail, loadCustomers]);

  const pendingCount = useMemo(
    () => customers.filter((customer) => customer.status === 'pending_documents').length,
    [customers],
  );
  const reviewCount = useMemo(
    () => customers.filter((customer) => customer.status === 'ready_for_review').length,
    [customers],
  );
  const escalatedCount = useMemo(
    () => customers.filter((customer) => customer.status === 'escalated').length,
    [customers],
  );

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          Loading your customer queue...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-900/80 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-white">Unable to load customers</CardTitle>
          <CardDescription className="text-gray-400">{error}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button onClick={loadCustomers} variant="outline" className="border-gray-700 text-white">
            Try again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">My Cases</h2>
        <p className="text-sm text-gray-400">Monitor assigned cases and jump into the next review</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gray-900/60 border-gray-800 text-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Total Cases</CardDescription>
            <CardTitle className="text-4xl font-bold text-white">{customers.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-gray-900/60 border-gray-800 text-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Pending Documents</CardDescription>
            <CardTitle className="text-4xl font-bold text-yellow-300">{pendingCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-gray-900/60 border-gray-800 text-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-gray-400">Escalations</CardDescription>
            <CardTitle className="text-4xl font-bold text-purple-300">{escalatedCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-gray-900/60 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-white">My Assigned Cases</CardTitle>
          <CardDescription className="text-gray-400">
            {pendingCount} pending • {reviewCount} ready for review
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              No customers have been assigned to you yet.
            </div>
          ) : (
            <div className="space-y-4">
              {customers.map((customer) => {
                const assignedDate = customer.assignedDate
                  ? new Date(customer.assignedDate).toLocaleDateString()
                  : 'N/A';

                return (
                  <div
                    key={customer._id}
                    className="flex flex-col gap-4 rounded-2xl border border-gray-800 bg-black/20 p-4 transition hover:border-blue-500/50 hover:bg-black/30 md:flex-row md:items-center md:gap-6"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">{customer.name}</h3>
                        <Badge className={`${statusColors[customer.status]} border-0`}>
                          {statusLabels[customer.status]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{customer.email}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="uppercase tracking-wide text-gray-400">
                          {customer.accountType}
                        </span>
                        <span>•</span>
                        <span>Source: {customer.source}</span>
                        <span>•</span>
                        <span>Assigned {assignedDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 md:justify-end">
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Documents</p>
                        <p className="text-lg font-semibold text-white">{customer.documents?.length || 0}</p>
                      </div>
                      <Button
                        onClick={() => router.push(`/dashboard/customer/${customer._id}`)}
                        className="min-w-[160px]"
                        variant={customer.status === 'pending_documents' ? 'default' : 'secondary'}
                      >
                        {customer.status === 'pending_documents' ? 'Upload Documents' : 'View Details'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
