import { cn } from '@shared/lib/utils';
import { Loader2Icon } from 'lucide-react';

function Spinner({ className, ...props }: Readonly<React.ComponentProps<'svg'>>) {
  return (
    <output aria-live="polite">
      <Loader2Icon aria-hidden="true" className={cn('size-4 animate-spin', className)} {...props} />
      <span className="sr-only">Loading</span>
    </output>
  );
}

export { Spinner };
