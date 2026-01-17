"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center gap-6 px-4">
      <h1 className="text-4xl font-semibold text-gray-900">404</h1>

      <p className="text-gray-600 max-w-md">
        Something went wrong or the page you’re looking for doesn’t exist.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Go Back
        </button>

        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}