export default function AdminFooter() {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Purna Chandra Diagnostic Center. All rights reserved. Made
            with ❤️ by{" "}
            <a href="https://bichitra.com.np" className="text-blue-600 hover:underline">
              Bichitra.
            </a>
        </div>
      </footer>
    );
  }