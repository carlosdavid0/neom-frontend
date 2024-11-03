import LogoSVG from '@/assets/svgs/Logo';
import { SheetMenu } from '@/components/Sidebar/sheet-menu';
import { useTheme } from '@/hook/useTheme';
import { ModeToggle } from '../mode-toggle';
import LanguageSelector from './language';
import { UserNav } from './user-nav';

type NavbarProps = {
  title?: string;
};

export function Navbar({ title }: NavbarProps) {
  const { theme } = useTheme();
  return (
    <header className='sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary'>
      <div className='mx-4 sm:mx-8 flex h-14 items-center'>
        <div className='flex items-center space-x-4 lg:space-x-0'>
          <div className='flex items-center gap-1'>
            <LogoSVG fill={theme ? 'black' : 'white'} width={30} className='block lg:hidden' />
            <SheetMenu />
          </div>
          <h1 className='font-bold'>{title}</h1>
        </div>
        <div className='flex flex-1 items-center space-x-2 justify-end'>
          <div className='hidden lg:block'>
            <LanguageSelector />
          </div>
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
