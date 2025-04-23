import { CircleDashed, GaugeCircle, Fuel, XCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CarFiltersProps {
  onFilterChange: (filters: Partial<{ bodyType: string; fuel: string; transmission: string; sort: string }>) => void;
  filters: { bodyType: string; fuel: string; transmission: string; sort: string };
}

const CarFilters: React.FC<CarFiltersProps> = ({ onFilterChange, filters }) => {
  const transmissions = ['automatic', 'manual', 'semi_automatic', 'CVT'];
  const bodyTypes = ['Sedan', 'SUV', 'Coupe', 'Convertible', 'Wagon', 'Limousine'];
  const fuelTypes = ['gasoline', 'diesel', 'electric', 'hybrid', 'plugin_hybrid'];
  const sortOptions = ['Ending soon', 'Newly listed', 'No reserve'];

  const handleSelectChange = (key: string, value: string) => {
    onFilterChange({ [key]: value.toLowerCase() });
  };

  const handleSortChange = (sort: string) => {
    onFilterChange({ sort: sort.toLowerCase().replace(' ', '-') });
  };

  const clearAllFilters = () => {
    onFilterChange({
      bodyType: '',
      fuel: '',
      transmission: '',
      sort: 'ending-soon',
    });
  };

  const isAnyFilterActive = () => {
    return filters.bodyType !== '' || 
           filters.fuel !== '' || 
           filters.transmission !== '' || 
           filters.sort !== 'ending-soon';
  };

  return (
    <div className="w-full bg-black py-2 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Transmission Filter */}
          <div className="relative min-w-[160px]">
            <Select 
              value={filters.transmission}
              onValueChange={(value) => handleSelectChange('transmission', value)}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white h-9 pl-9">
                <GaugeCircle className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <SelectValue placeholder="Transmission" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                {transmissions.map((transmission) => (
                  <SelectItem key={transmission} value={transmission.toLowerCase()}>
                    {transmission}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Body Type Filter */}
          <div className="relative min-w-[160px]">
            <Select 
              value={filters.bodyType}
              onValueChange={(value) => handleSelectChange('bodyType', value)}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white h-9 pl-9">
                <CircleDashed className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <SelectValue placeholder="Body Type" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                {bodyTypes.map((bodyType) => (
                  <SelectItem key={bodyType} value={bodyType.toLowerCase()}>
                    {bodyType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fuel Type Filter */}
          <div className="relative min-w-[160px]">
            <Select 
              value={filters.fuel}
              onValueChange={(value) => handleSelectChange('fuel', value)}
            >
              <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white h-9 pl-9">
                <Fuel className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <SelectValue placeholder="Fuel Type" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700 text-white">
                {fuelTypes.map((fuelType) => (
                  <SelectItem key={fuelType} value={fuelType.toLowerCase()}>
                    {fuelType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Clear All Button - Only visible when filters are active */}
          {isAnyFilterActive() && (
            <button
              onClick={clearAllFilters}
              className="flex items-center text-sm px-3 py-1.5 rounded-md bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
            >
              <XCircle className="h-4 w-4 mr-1.5" />
              Clear All
            </button>
          )}
          
          {/* Spacer */}
          <div className="flex-grow"></div>

          {/* Sort Options */}
          <div className="flex items-center space-x-4 overflow-x-auto whitespace-nowrap pb-1 max-w-full">
            {sortOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleSortChange(option)}
                className={`text-sm px-2 py-1 rounded-md whitespace-nowrap transition-colors ${
                  filters.sort === option.toLowerCase().replace(' ', '-') ? 'text-white border-b-2 border-[#3BE188]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarFilters;