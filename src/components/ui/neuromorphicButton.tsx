type Props = {
  children: React.ReactNode;
  onClick: () => void;
};

export const NeuromorphicButton = ({ children, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="
          px-6 py-3
          bg-gray-200
          rounded-xl
          shadow-[5px_5px_10px_#b8b9be,-5px_-5px_10px_#ffffff]
          hover:shadow-[inset_5px_5px_10px_#b8b9be,inset_-5px_-5px_10px_#ffffff]
          active:shadow-[inset_5px_5px_10px_#b8b9be,inset_-5px_-5px_10px_#ffffff]
          transition-all duration-300 ease-in-out
          text-gray-700 font-semibold
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50
          sm:text-sm md:text-base lg:text-lg
          sm:px-4 sm:py-2 md:px-6 md:py-3 lg:px-8 lg:py-4
          w-full
        "
    >
      {children}
    </button>
  );
};
