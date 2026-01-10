const LineLoading: React.FC = () => {
  return (
    <div className="fixed left-0 top-0 z-[9999999999] h-0.5 w-full overflow-hidden bg-[#13141A1A] bg-gradient-to-r from-blue-500 to-blue-300">
      <div className="animate-loading-bar absolute left-0 top-0 size-full bg-gradient-to-r from-blue-100 to-blue-800" />
    </div>
  );
};

export default LineLoading;
