import type { Dispatch, SetStateAction } from 'react';
import { Menu } from '@headlessui/react';
import { 
  IconLogin, IconLogout, IconChevronsDown, IconX, 
  IconSettings, IconWriting, IconPizza 
} from '@tabler/icons';
import { useAuthContext } from 'utils/useAuth';
import { useStore } from 'lib/store';
import Tooltip from 'components/misc/Tooltip';
import { DropdownItem } from 'components/misc/Dropdown';
import { isMobile } from 'utils/helper';
import Logo from 'components/Logo';

type Props = {
  setIsSettingsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function SidebarHeader(props: Props) {
  const { setIsSettingsOpen } = props;
  const { user, signOut } = useAuthContext();
  const setIsSidebarOpen = useStore((state) => state.setIsSidebarOpen);
  const linkItemClass = "border-t dark:border-gray-700 hover:bg-gray-100 hover:dark:bg-gray-700";

  return (
    <div className="relative">
      <Menu>
        <Menu.Button className="flex items-center justify-between w-full py-2 pl-6 overflow-x-hidden text-left text-gray-800 hover:bg-gray-200 active:bg-gray-300 dark:text-gray-200 dark:hover:bg-gray-700 dark:active:bg-gray-600 overflow-ellipsis whitespace-nowrap focus:outline-none">
          <div className="flex items-center flex-1">
            <Logo width={24} height={24} />
            <span className="mr-1 px-1 font-semibold select-none">mdSilo</span>
            <IconChevronsDown size={18} className="text-gray-500 dark:text-gray-400" />
          </div>
          <Tooltip content="Collapse sidebar (Alt+X)" placement="right">
            <span
              className="p-1 mr-2 rounded hover:bg-gray-300 active:bg-gray-400 dark:hover:bg-gray-600 dark:active:bg-gray-500"
              onClick={(e) => {
                e.stopPropagation();
                setIsSidebarOpen(false);
              }}
            >
              <IconX className="text-gray-500 dark:text-gray-400" />
            </span>
          </Tooltip>
        </Menu.Button>
        <Menu.Items className="absolute z-20 w-56 overflow-hidden bg-white rounded left-6 top-full shadow-popover dark:bg-gray-800 focus:outline-none">
          <p className="px-4 pt-2 pb-1 overflow-hidden text-xs text-gray-600 overflow-ellipsis dark:text-gray-400">
            {user?.email}
          </p>
          <DropdownItem
            onClick={() => {
              if (isMobile()) {
                setIsSidebarOpen(false);
              }
              setIsSettingsOpen(true);
            }}
          >
            <IconSettings size={18} className="mr-1" />
            <span>Settings</span>
          </DropdownItem>
          <DropdownItem className={linkItemClass} as='link' href='/app'>
            <IconWriting size={18} className="mr-1" />
            <span>New Workspace</span>
          </DropdownItem>
          <DropdownItem
            className="border-t dark:border-gray-700 hover:bg-green-400"
            as='link'
            href='/sponsors'
          >
            <IconPizza size={18} className="mr-1" />
            <span>Sponsor</span>
          </DropdownItem>
          {!user ? (
            <DropdownItem className={linkItemClass} as='link' href='/signin'>
              <IconLogin size={18} className="mr-1" />
              <span>Sign in</span>
            </DropdownItem>
          ) : (
            <DropdownItem
              className="border-t dark:border-gray-700"
              onClick={() => signOut()}
            >
              <IconLogout size={18} className="mr-1" />
              <span>Sign out</span>
            </DropdownItem>
          )}
        </Menu.Items>
      </Menu>
    </div>
  );
}
