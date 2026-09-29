import React from 'react';
import { Badge } from '../ui/Badge';

export interface StatusPillProps {
  status: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const normalized = status.toLowerCase().replace(/[\s_-]+/g, '');

  let variant: 'orange' | 'cyan' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate' = 'slate';

  if (['active', 'completed', 'passed', 'confirmed', 'succeeded', 'won', 'optimal'].includes(normalized)) {
    variant = 'emerald';
  } else if (['draft', 'waitlisted', 'pending', 'heldforreview', 'underinvestigation'].includes(normalized)) {
    variant = 'amber';
  } else if (['underreview', 'inreview', 'scoringcompleted', 'indeliberation', 'submitted', 'registered'].includes(normalized)) {
    variant = 'orange';
  } else if (['failed', 'rejected', 'suspended', 'cancelled', 'needsattention'].includes(normalized)) {
    variant = 'rose';
  } else if (['published'].includes(normalized)) {
    variant = 'slate';
  }

  return <Badge variant={variant} size="sm">{status}</Badge>;
};
