'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Customer } from '@/lib/types';

const statusColors = {
  pending_documents: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  ready_for_review: 'bg-green-100 text-green-800',
  escalated: 'bg-purple-100 text-purple-800',
  awaiting_additional_docs: 'bg-orange-100 text-orange-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const statusLabels = {
  pending_documents: 'Pending Documents',
  processing: 'Processing',
  ready_for_review: 'Ready for Review',
  escalated: 'Escalated',
  awaiting_additional_docs: 'Awaiting Docs',
  approved: 'Approved',
  rejected: 'Rejected',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCustomers(user.email);
    }
  }, [user]);

  const fetchCustomers = async (email: string) => {
    try {
      const response = await fetch(`/api/customers?analyst=${encodeURIComponent(email)}`);
      const data = await response.json();
      setCustomers(data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = customers.filter((c) => c.status === 'pending_documents').length;
  const reviewCount = customers.filter((c) => c.status === 'ready_for_review').length;

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
          <div className="text-sm font-medium text-gray-400">Total Cases</div>
          <div className="text-3xl font-bold text-white mt-2">{customers.length}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
          <div className="text-sm font-medium text-gray-400">Pending Documents</div>
          <div className="text-3xl font-bold text-yellow-400 mt-2">{pendingCount}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
          <div className="text-sm font-medium text-gray-400">Ready for Review</div>
          <div className="text-3xl font-bold text-green-400 mt-2">{reviewCount}</div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700/50">
        <div className="p-6 border-b border-gray-700/50">
          <h3 className="text-xl font-semibold text-white">My Assigned Cases</h3>
          <p className="text-gray-400 mt-1">
            You have {pendingCount} pending cases and {reviewCount} reports ready for review
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {customers.map((customer) => (
              <div
                key={customer._id?.toString()}
                className="flex items-center justify-between rounded-lg border border-gray-700/50 p-4 hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{customer.name}</h4>
                  <p className="text-sm text-gray-400">{customer.email}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                    <span>Account: {customer.accountType}</span>
                    <span>•</span>
                    <span>Assigned: {new Date(customer.assignedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[customer.status]}`}>
                    {statusLabels[customer.status]}
                  </span>
                  <button
                    onClick={() => router.push(`/dashboard/customer/${customer._id}`)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      customer.status === 'pending_documents'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {customer.status === 'pending_documents' ? 'Upload Documents' : 'View Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}