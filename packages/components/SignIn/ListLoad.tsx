export function ListLoad() {
  return (
    <div className="mt-3 grid grid-cols-3 gap-3">
      {Array.from({ length: 3 }).map((_, key) => (
        <div
          key={key}
          className="h-20 w-full animate-pulse bg-shaftkings-gray-100"
        />
      ))}
    </div>
  );
}
