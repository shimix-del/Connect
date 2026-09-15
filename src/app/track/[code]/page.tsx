import { INITIAL_BOOKINGS } from '@/lib/seedData';
import BookingTrackerClient from './BookingTrackerClient';

export function generateStaticParams() {
  return INITIAL_BOOKINGS.map((booking) => ({
    code: booking.trackingCode,
  }));
}

export default function BookingTrackerPage({ params }: { params: { code: string } }) {
  return <BookingTrackerClient code={params.code} />;
}
