import GroupsTwoToneIcon from '@mui/icons-material/GroupsTwoTone';
import { NavLink, useLocation } from 'react-router-dom';
import  ThemeToggle  from '../shared/ThemeToggle';
import Tooltip from '@mui/material/Tooltip';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone'

const CrowdMark = () => (
  <div className="relative w-8 h-8 dark:bg-red-500 bg-black rounded-md flex items-center justify-center text-white">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-md bg-black dark:bg-red-400 opacity-40" />
    <span className="relative">
      <GroupsTwoToneIcon />     
    </span>
  </div>
);



function Navbar() {
  const location = useLocation();


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b border-white/15 bg-white/10 dark:bg-slate-950/20 dark:border-white/10 backdrop-blur-xl shadow-sm">
    <div className="flex items-center gap-1">
      <CrowdMark />
      <span className="text-[15px] text-black dark:text-white font-bold tracking-[-0.02em]">
        CROWD<span className="text-red-500">SOURCE</span>
      </span>
    </div>
    <div className='flex items-center gap-2'>
    {location.pathname !== '/dashboard' && (
      location.pathname === '/report' ?
        <NavLink to="/" >
          <Tooltip title="Home">
            <span  className="bg-black/20 dark:bg-red-500/20 dark:text-red-500 border dark:border-red-500/35 px-2 py-2 rounded-lg">
              <HomeTwoToneIcon />
            </span>
          </Tooltip>
        </NavLink>
      :
        <NavLink to="/report">
          <span  className="font-mono-custom text-[10px] bg-black/20 dark:bg-red-500/20 dark:text-red-500 border dark:border-red-500/35 px-3 py-1 rounded-full tracking-[0.08em]">
            SUBMIT REPORT
          </span>
        </NavLink>
    )}
    <ThemeToggle />
    </div>
  </nav>
  );
};

export default Navbar;