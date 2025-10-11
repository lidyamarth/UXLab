"use client";
import { AuthProvider } from '../../lib/AuthContext';

export function ClientAuthProvider({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}