import { navbarRef } from '@/lib/refs';

import { SidebarToggler } from '../sidebar/sidebarToggler';

import { Breadcrumb } from '@/components/shared/navigation/breadcrumb';


interface NavbarProps {
  className?: string;
  handleLogout?: () => void;
}

export const Navbar = ({ className }: NavbarProps) => {

  return (
    <header
      ref={navbarRef}
      className={`flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-slate-900 backdrop-blur-sm border-b border-slate-800 z-50 ${className}`}
    >
      <div className="flex flex-row items-center gap-2 px-4">
        <SidebarToggler />
        <div data-orientation="vertical" role="none" data-slot="separator-root" className="bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mr-2 !h-4"></div>
        {/* <Breadcrumb /> */}
        <Breadcrumb
          homeLabel="Stargate Command Center"
          itemClassName="text-sm text-cyan-400 font-poppins tracking-wide font-semibold"
          iconClassName="text-cyan-200"
        />

      </div>
    </header>
  )
}
