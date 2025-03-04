'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

type Option = {
  id: string;
  name: string;
};

type MultiSelectProps = {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxHeight?: number;
  emptyMessage?: string;
};

export default function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  className,
  disabled = false,
  maxHeight = 200,
  emptyMessage = 'No results found.',
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  // Fungsi untuk mendapatkan nama dari ID yang dipilih
  const getOptionName = (id: string): string => {
    const option = options.find((opt) => opt.id === id);
    return option ? option.name : id;
  };

  const handleUnselect = (id: string) => {
    onChange(selected.filter((selectedId) => selectedId !== id));
  };

  const handleSelectAll = () => {
    onChange(options.map((option) => option.id));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  // Filter opsi berdasarkan input pengguna
  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  // Opsi yang dapat dipilih (belum dipilih)
  const selectableOptions = filteredOptions.filter((option) => !selected.includes(option.id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between h-auto min-h-10 px-3 py-2',
            selected.length > 0 ? 'h-auto' : '',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
            className,
          )}
          onClick={() => setOpen(!open)}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 items-center">
            {selected.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selected.map((id) => (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="mr-1 mb-1 text-xs px-2 py-0.5 bg-primary/10 hover:bg-primary/20 transition-colors"
                  >
                    {getOptionName(id)}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUnselect(id);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUnselect(id);
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 shadow-md border-primary/10" align="start">
        <Command className="w-full">
          <div className="flex items-center border-b px-3 pb-2 pt-3">
            <CommandInput
              placeholder={`Search...`}
              value={inputValue}
              onValueChange={setInputValue}
              className="flex-1 h-9"
            />
            {inputValue && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInputValue('')}
                className="h-8 px-2 text-xs"
              >
                Clear
              </Button>
            )}
          </div>

          {options.length > 0 && (
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <span className="text-sm text-muted-foreground mr-2">
                Selected: {selected.length} of {options.length}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="h-7 text-xs"
                  disabled={selected.length === options.length}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-7 text-xs"
                  disabled={selected.length === 0}
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}

          <CommandList className={`max-h-[${maxHeight}px] overflow-auto`}>
            <CommandEmpty className="py-6 text-center text-sm">{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {selectableOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name} // Menggunakan name untuk pencarian
                  onSelect={() => {
                    onChange([...selected, option.id]);
                  }}
                  className="cursor-pointer aria-selected:bg-primary/10"
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        selected.includes(option.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50',
                      )}
                    >
                      {selected.includes(option.id) && <Check className="h-3 w-3" />}
                    </div>
                    <span>{option.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
