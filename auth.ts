import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
function emails(name: string) { return (process.env[name] || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean); }
export function roleFor(email?: string | null) { const e = email?.toLowerCase(); return e && emails('ADMIN_EMAILS').includes(e) ? 'admin' : e && emails('EDITOR_EMAILS').includes(e) ? 'editor' : null; }
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: { signIn: '/admin/login', error: '/admin/login' },
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  callbacks: {
    signIn({ profile, user }) { return profile?.email_verified === true && !!roleFor(user.email); },
    authorized({ auth: session }) { return !!roleFor(session?.user?.email); }
  }
});
export async function staffUser() { const session = await auth(); const role = roleFor(session?.user?.email); return role && session?.user?.email ? { email: session.user.email, role } : null; }
