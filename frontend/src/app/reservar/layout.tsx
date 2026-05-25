import { BookingProvider } from '@/context/BookingContext'

export default function ReservarLayout({ children }: { children: React.ReactNode }) {
  return <BookingProvider>{children}</BookingProvider>
}
