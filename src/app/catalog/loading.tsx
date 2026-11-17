export default function CatalogLoading() {
  return (
    <main aria-busy="true" aria-label="Loading catalog" className="mx-auto min-h-[60vh] max-w-7xl px-5 py-12 lg:px-8">
      <div className="h-3 w-36 animate-pulse rounded bg-[#E9DED0]" />
      <div className="mt-4 h-10 w-72 max-w-full animate-pulse rounded-xl bg-[#E9DED0]" />
      <div className="mt-4 h-4 w-full max-w-2xl animate-pulse rounded bg-[#F1E4D3]" />
      <div className="mt-9 grid gap-3 rounded-2xl border border-[#E9DED0] bg-white p-4 sm:grid-cols-[1fr_220px]">
        <div className="h-11 animate-pulse rounded-xl bg-[#F1E4D3]" />
        <div className="h-11 animate-pulse rounded-xl bg-[#F1E4D3]" />
      </div>
      <div className="mt-7 grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-[#E9DED0] bg-white p-3">
            <div className="aspect-[3/4] animate-pulse rounded-xl bg-[#F1E4D3]" />
            <div className="mt-4 h-6 animate-pulse rounded bg-[#F1E4D3]" />
            <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-[#F1E4D3]" />
            <div className="mt-5 h-10 animate-pulse rounded-full bg-[#E9DED0]" />
          </div>
        ))}
      </div>
    </main>
  );
}
