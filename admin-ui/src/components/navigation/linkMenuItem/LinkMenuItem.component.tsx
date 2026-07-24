import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import {IMenuItemProps} from "../../../utils";



function LinkMenuItem({ path, title, icon }: IMenuItemProps) {
  return (
    <Menu.Item key={path} icon={icon}>
      <Link to={path} data-cy={'custom-slider-settings'}>
        {title}
      </Link>
    </Menu.Item>
  );
}

export default LinkMenuItem;
