export default function AdminFooter() {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="bg-white border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm text-gray-500">
          <p>
            &copy; {currentYear} Medical Admin Portal. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }