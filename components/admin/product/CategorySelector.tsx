'use client';

import { cn } from '@/lib/utils';
import { Category } from '@/types';

type CategorySelectorProps = {
  categories: Category[];
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
};

export function CategorySelector({
  categories,
  selectedCategories,
  setSelectedCategories,
}: CategorySelectorProps) {
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm">Category</h3>
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryToggle(category.id)}
            className={cn(
              'px-3 py-1 rounded-full text-sm cursor-pointer',
              selectedCategories.includes(category.id)
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground',
            )}
          >
            {category.name}
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground">Tidak ada kategori tersedia</p>
        )}
      </div>
    </div>
  );
}
