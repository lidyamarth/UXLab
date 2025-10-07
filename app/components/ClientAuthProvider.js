"use client";
import { AuthProvider } from '../../lib/AuthContext';

export default function ClientAuthProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
