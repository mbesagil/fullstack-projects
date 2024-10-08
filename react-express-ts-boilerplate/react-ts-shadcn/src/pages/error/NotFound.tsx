import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="bg-gray-100 p-3 rounded-md">
        <h1 className="text-2xl font-bold mb-2">404 - Sayfa Bulunamadı</h1>
        <p className="mb-4">Üzgünüz, aradığınız sayfa mevcut değil.</p>
        <Link to="/" className="text-blue-500 hover:text-blue-600 underline">
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  );
};

export default NotFound;