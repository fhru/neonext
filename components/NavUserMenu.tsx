import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Gauge } from 'lucide-react';

export default function NavUserMenu() {
  const { isLoaded, user } = useUser();
  if (!isLoaded) return null;

  const isAdmin = user?.publicMetadata?.role === 'admin';

  return (
    <>
      <ThemeToggle />
      <SignedOut>
        <SignInButton>
          <Button>Sign In</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            {isAdmin && (
              <UserButton.Link
                label="Admin Dashboard"
                labelIcon={<Gauge size={16} />}
                href="/admin/dashboard"
              />
            )}
            <UserButton.Action label="manageAccount" />
            <UserButton.Action label="signOut" />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
    </>
  );
}
