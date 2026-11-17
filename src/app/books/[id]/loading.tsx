export default function BookDetailsLoading() {
  return (
    <main aria-busy="true" aria-label="Loading book details" className="mx-auto min-h-[60vh] max-w-5xl px-5 py-12 lg:px-8">
      <div className="h-5 w-36 animate-pulse rounded bg-[#E9DED0]" />
      <div className="mt-8 grid gap-10 md:grid-cols-[minmax(250px,.8fr)_1.2fr]">
        <div className="mx-auto aspect-[3/4] w-full max-w-sm animate-pulse rounded-3xl bg-[#F1E4D3]" />
        <div className="py-3">
          <div className="h-4 w-28 animate-pulse rounded bg-[#E9DED0]" />
          <div className="mt-4 h-12 w-full animate-pulse rounded-xl bg-[#F1E4D3]" />
          <div className="mt-3 h-5 w-2/3 animate-pulse rounded bg-[#F1E4D3]" />
          <div className="mt-8 h-40 animate-pulse rounded-2xl bg-[#F1E4D3]" />
        </div>
      </div>
    </main>
  );
}
