export default function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">

        <p>
          © {new Date().getFullYear()} EthixPortal. All rights reserved.
        </p>

        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <span>Institutional Ethics Committee System</span>
        </div>

      </div>
    </footer>
  );
}