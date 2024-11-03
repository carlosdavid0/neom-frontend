import LogoSVG from '@/assets/svgs/Logo';
import { Menu } from '@/components/Sidebar/menu';
import { SidebarToggle } from '@/components/Sidebar/sidebar-toggle';
import { useSidebarToggle } from '@/hook/use-sidebar-toggle';
import { useStore } from '@/hook/use-store';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);


  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300 bg-slate-950',
        sidebar?.isOpen === false ? 'w-[90px]' : 'w-72',
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className='relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800'>
        <div className='flex items-center gap-2 h-10 px-3'>
          <LogoSVG fill='white' width={50} />
          {sidebar?.isOpen && <h1 className='text-xl font-bold text-white'>NEOM Networks</h1>}
        </div>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}
