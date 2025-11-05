export const LoadingOverlay = ({ show, label = 'Memuat...' }: { show: boolean; label?: string }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[900] bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div className="px-5 py-3 rounded-xl bg-white dark:bg-gray-800 shadow text-gray-700 dark:text-gray-200 flex items-center gap-3">
        <span className="inline-block w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
};


