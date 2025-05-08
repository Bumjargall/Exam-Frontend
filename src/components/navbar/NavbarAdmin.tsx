import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NavbarAdmin() {
  const router = useRouter();

  const logoutUser = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <header className="w-full shadow-sm border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-medium">
          <img src="/logo.jpg" alt="logo" className="w-12 rounded-xl" />
        </Link>

        <nav className="flex space-x-6 items-center">
          <Link
            href="/admin/dashboard"
            className="text-gray-700 hover:text-black text-sm border border-gray-900 p-2 px-4 rounded-lg hover:bg-gray-100"
          >
            Админ самбар
          </Link>
          <Link
            href="/admin/profile"
            className="text-gray-600 hover:border p-2 rounded-lg border-gray-900"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            onClick={logoutUser}
            className="text-gray-600 hover:border p-2 rounded-lg border-gray-900"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </nav>
      </div>
    </header>
  );
}
