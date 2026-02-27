import { redirect } from 'next/navigation';

export default function RootPage() {
  // As soon as they hit the link, they go to /admin
  redirect('/admin');
  
  // This return is just a fallback while the redirect happens
  return null;
}