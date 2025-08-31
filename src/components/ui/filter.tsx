import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { Button } from "./button";

interface FilterField {
  key: string;
  label: string;
  type: "checkbox" | "radio" | "select" | "date";
  options: { value: string; label: string }[];
}

interface FilterProps {
  filterFields: FilterField[];
  onFilter: (filters: Record<string, string[]>) => void;
}

export const Filter = ({ filterFields, onFilter }: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const handleFilterChange = (key: string, value: string, isChecked: boolean) => {
    const newFilters = { ...filters };
    if (isChecked) {
      newFilters[key] = [...(newFilters[key] || []), value];
    } else {
      newFilters[key] = (newFilters[key] || []).filter((v) => v !== value);
    }
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className='relative'>
      <Button
        title='Filter'
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center px-4 py-2 text-sm bg-green-500 text-white rounded  hover:bg-green-600 focus:outline-none focus:ring-2'
      >
        <FaFilter />
        {" Filter"}
      </Button>
      {isOpen && (
        <div className='absolute right-0 mt-2 w-64 bg-white dark:bg-[#1C1C1D]    border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 p-4'>
          {filterFields.map((field) => (
            <div key={field.key} className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>{field.label}</label>
              {field.type === "checkbox" || field.type === "radio" ? (
                <div className='space-y-2'>
                  {field.options.map((option) => (
                    <div key={option.value} className='flex items-center gap-2'>
                      <input
                        type={field.type}
                        id={`${field.key}-${option.value}`}
                        name={field.key}
                        value={option.value}
                        checked={(filters[field.key] || []).includes(option.value)}
                        onChange={(e) => handleFilterChange(field.key, option.value, e.target.checked)}
                        className={`h-4 w-4 ${
                          field.type === "checkbox"
                            ? "rounded text-primary focus:ring-primary"
                            : "text-primary focus:ring-primary"
                        } border-gray-300 dark:border-gray-600 dark:bg-[#1C1C1D]   `}
                      />
                      <label
                        htmlFor={`${field.key}-${option.value}`}
                        className='text-sm text-gray-700 dark:text-gray-300'
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              ) : field.type === "select" ? (
                <select
                  value={filters[field.key]?.[0] || ""}
                  onChange={(e) => handleFilterChange(field.key, e.target.value, true)}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm text-gray-700 dark:text-gray-300 dark:bg-[#1C1C1D]   '
                >
                  <option value=''>All</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
