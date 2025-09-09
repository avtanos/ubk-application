'use client';

interface StatusBadgeProps {
  status: 'approved' | 'pending' | 'rejected' | 'high-risk' | 'medium-risk' | 'low-risk' | 'success' | 'warning' | 'danger' | 'neutral' | 'info' | 'error';
  children: React.ReactNode;
  className?: string;
}

export default function StatusBadge({ status, children, className = '' }: StatusBadgeProps) {
  const statusClasses = {
    'approved': 'status-badge status-approved',
    'pending': 'status-badge status-pending',
    'rejected': 'status-badge status-rejected',
    'high-risk': 'status-badge status-high-risk',
    'medium-risk': 'status-badge status-medium-risk',
    'low-risk': 'status-badge status-low-risk',
    'success': 'status-badge status-approved',
    'warning': 'status-badge status-pending',
    'danger': 'status-badge status-rejected',
    'neutral': 'status-badge status-medium-risk',
    'info': 'status-badge status-low-risk',
    'error': 'status-badge status-rejected',
  };

  return (
    <span className={`${statusClasses[status]} ${className}`}>
      {children}
    </span>
  );
}
