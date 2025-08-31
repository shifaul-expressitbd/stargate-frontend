import { FiSearch } from "react-icons/fi";

const SearchInput = () => {
  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        className="w-full h-12 pl-5 pr-12 rounded-full border border-gray-300 bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder-gray-500 transition-all"
        placeholder="Type to search..."
      />
      <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg cursor-pointer" />
    </div>
  );
};

export default SearchInput;
