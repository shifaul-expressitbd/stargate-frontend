import { createRef } from 'react';

export const navbarRef = createRef<HTMLDivElement>();
export const sidebarRef = { current: null as HTMLElement | null };
