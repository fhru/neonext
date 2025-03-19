import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ProductImageAddForm from './AddForm';

interface ProductImageAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductImageAddDialog({ open, onOpenChange }: ProductImageAddDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Image</DialogTitle>
          <DialogDescription className="pt-4">
            <ProductImageAddForm />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
