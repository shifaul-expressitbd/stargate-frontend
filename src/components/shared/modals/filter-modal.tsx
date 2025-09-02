import { useState } from "react";
import { Button } from "../buttons/button";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterFields: {
    key: string;
    label: string;
    type: "checkbox" | "radio" | "select";
    options: { value: string; label: string }[];
  }[];
  onApply: (filters: Record<string, string[]>) => void;
}

export const FilterModal = ({
  isOpen,
  onClose,
  filterFields,
  onApply,
}: FilterModalProps) => {
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const handleFilterChange = (
    key: string,
    value: string,
    isChecked: boolean
  ) => {
    const newFilters = { ...filters };
    if (isChecked) {
      newFilters[key] = [...(newFilters[key] || []), value];
    } else {
      newFilters[key] = (newFilters[key] || []).filter((v) => v !== value);
    }
    setFilters(newFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-primary-dark    p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Filter</h2>
        {filterFields.map((field) => (
          <div key={field.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {field.label}
            </label>
            {field.type === "checkbox" || field.type === "radio" ? (
              <div className="space-y-2">
                {field.options.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <input
                      type={field.type}
                      id={`${field.key}-${option.value}`}
                      name={field.key}
                      value={option.value}
                      checked={(filters[field.key] || []).includes(
                        option.value
                      )}
                      onChange={(e) =>
                        handleFilterChange(
                          field.key,
                          option.value,
                          e.target.checked
                        )
                      }
                      className={`h-4 w-4 ${field.type === "checkbox"
                        ? "rounded text-primary focus:ring-primary"
                        : "text-primary focus:ring-primary"
                        } border-gray-300 dark:border-gray-600 dark:bg-primary-dark   `}
                    />
                    <label
                      htmlFor={`${field.key}-${option.value}`}
                      className="text-sm text-gray-700 dark:text-gray-300"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            ) : field.type === "select" ? (
              <select
                value={filters[field.key]?.[0] || ""}
                onChange={(e) =>
                  handleFilterChange(field.key, e.target.value, true)
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm text-gray-700 dark:text-gray-300 dark:bg-primary-dark   "
              >
                <option value="">All</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : null}
          </div>
        ))}
        <div className="flex justify-end gap-4 mt-6">
          <Button title="Cancel" onClick={onClose}>
            Cancel
          </Button>
          <Button title="Apply" onClick={() => onApply(filters)}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};
