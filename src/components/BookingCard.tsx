"use client";

import { StatusBadge } from "./StatusBadge";
import { ActionButton } from "./ActionButton";

export type BookingRow = {
  id: string;
  title: string;
  notes: string | null;
  price: number;
  status: string;
  createdAt: string;
  customer: { id: string; name: string; email: string; phone: string };
  provider: { id: string; name: string; email: string; phone: string };
};

export function BookingCard({
  booking,
  onAccept,
  onDecline,
}: {
  booking: BookingRow;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}) {
  return (
    <div className="rounded-[10px] border border-border-subtle bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-medium">{booking.title}</div>
          <div className="mt-1 text-sm text-ink-muted">
            {booking.customer.name} to {booking.provider.name}
          </div>
          {booking.notes && (
            <div className="mt-2 text-sm text-ink-muted">{booking.notes}</div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge status={booking.status} />
          <div className="text-sm font-medium">${booking.price.toFixed(2)}</div>
        </div>
      </div>

      {booking.status === "PENDING" && (
        <div className="mt-4 flex gap-2">
          {onAccept && (
            <ActionButton onClick={() => onAccept(booking.id)}>
              Accept
            </ActionButton>
          )}
          {onDecline && (
            <ActionButton variant="danger" onClick={() => onDecline(booking.id)}>
              Decline
            </ActionButton>
          )}
        </div>
      )}
    </div>
  );
}
