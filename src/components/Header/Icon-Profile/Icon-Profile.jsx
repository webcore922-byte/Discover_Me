import React ,{useState} from "react";
import {
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import {
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
const profileMenuItems = [
  {
    label: "الملف الشخصي",
    icon: UserCircleIcon,
    route: '/userprofile'
  },
   
  {
    label: "تسجيل الخروج",
    icon: PowerIcon,
  },
];
 
const IconProfile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);    
  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center rounded-full p-0"
        >
          <Avatar
            variant="circular"
            size="md"
            alt="tania andrew"
            withBorder={true}
            color="blue-gray"
            className=" p-0.5"
            src="./me.jpeg"
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-2 border-none">
         <menuItem >
           <Typography
                as={Link}
                 to='/profile'
                variant="small"
                className="font-normal"
                color="blue"
              >
                الـملف الشخصي
              </Typography>
          <Typography
                as="span"
                variant="small"
                className="font-normal cursor-pointer"
                color="red"
              >
                تسجيل الخروج
              </Typography>
         </menuItem>
      </MenuList>
    </Menu>
  );
}

export default IconProfile;

