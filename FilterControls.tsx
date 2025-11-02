
import React, { useState } from 'react';
import { Filter } from '../types';
import { JAPANESE_FILTERS, FASHION_STYLE_FILTERS } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

interface FilterControlsProps {
  onSelectFilter: (filter: Filter) => void;
  isDisabled: boolean;
  onFilterHoverStart?: (filter: Filter) => void;
  onFilterHoverEnd?: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ onSelectFilter, isDisabled, onFilterHoverStart, onFilterHoverEnd }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filterByName = (filter: Filter) => 
    t(filter.key).toLowerCase().includes(searchQuery.toLowerCase());

  const filteredJapaneseFilters = JAPANESE_FILTERS.filter(filterByName);
  const filteredFashionFilters = FASHION_STYLE_FILTERS.filter(filterByName);

  const FilterGrid: React.FC<{filters: Filter[]}> = ({ filters }) => (
      <div className="grid grid-cols-3 gap-3">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onSelectFilter(filter)}
            onMouseEnter={() => onFilterHoverStart?.(filter)}
            onMouseLeave={() => onFilterHoverEnd?.()}
            disabled={isDisabled}
            className="group relative aspect-square w-full rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src={filter.thumbnail} alt={t(filter.key)} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-2 transition-opacity duration-300 group-hover:bg-opacity-20">
              <p className="text-white text-xs font-medium">{t(filter.key)}</p>
            </div>
          </button>
        ))}
      </div>
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
            type="text"
            placeholder={t('searchFiltersPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
            aria-label={t('searchFiltersAriaLabel')}
        />
      </div>
      
      {filteredJapaneseFilters.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">{t('aestheticFilters')}</h3>
          <FilterGrid filters={filteredJapaneseFilters} />
        </div>
      )}
      
      {filteredFashionFilters.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">{t('fashionStyles')}</h3>
          <FilterGrid filters={filteredFashionFilters} />
        </div>
      )}

      {filteredJapaneseFilters.length === 0 && filteredFashionFilters.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">{t('noFiltersFound', { searchQuery })}</p>
        </div>
      )}
    </div>
  );
};

export default FilterControls;
