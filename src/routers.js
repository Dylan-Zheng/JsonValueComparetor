import { Navigate, Outlet, useRoutes } from 'react-router';
import DashBoardLayout from './componets/dashboard-layout';
import HomeView from './views/home';
import HomeIcon from '@mui/icons-material/Home';
import ConfigComparetor from './views/config-comparetor';
import InputJsonTemplateView from './views/config-comparetor/inputJsonView';
import MappingView from './views/config-comparetor/mapperView';
import FolderNameView from './views/config-comparetor/folderNameView';
import FolderView from './views/folder-view';
import FolderIcon from '@mui/icons-material/Folder';
import JsonItemConfig from './views/folder-view/json-item-config-view';
import DescriptionIcon from '@mui/icons-material/Description';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import JsonItemView from './views/folder-view/json-item-view';
import SettingsIcon from '@mui/icons-material/Settings';

export const routers = [
  {
    path: "/",
    element: <DashBoardLayout><Outlet /></DashBoardLayout>,
    children: [
      {
        index: true,
        element: <Navigate to="app" />
      },
      {
        name: "Home",
        icon: HomeIcon,
        path: "app",
        element: <HomeView />,
      },
      {
        name: "Config-Comparetor",
        icon: CreateNewFolderIcon,
        path: "app/config/comparetor",
        element: <ConfigComparetor/>,
        children: [
          {
            index: true,
            element: <Navigate to="template" />
          },
          {
            name: "Templete",
            path: "template",
            element: <InputJsonTemplateView/>,
          },
          {
            name: "Mapping",
            path: "mapping",
            element: <MappingView/>,
          },
          {
            name: "Create",
            path: "create",
            element: <FolderNameView/>,
          }
        ]
      },
      {
        name: "Comparetor",
        icon: FolderIcon,
        path: "app/comparetor",
        element: <FolderView/>,
        children: [
          {
            name: "Config",
            icon: CreateNewFolderIcon,
            path: "config",
            element: <ConfigComparetor/>,
            children: [
              {
                index: true,
                element: <Navigate to="template" />
              },
              {
                name: "Templete",
                path: "template",
                element: <InputJsonTemplateView/>,
              },
              {
                name: "Mapping",
                path: "mapping",
                element: <MappingView/>,
              },
              {
                name: "Upate",
                path: "create",
                element: <FolderNameView/>,
              }
            ]
          },
          {
            name: "New-Json-Item",
            icon: SettingsIcon,
            path: "create/json",
            element: <JsonItemConfig/>,
          },
          {
            name: "Json-Item",
            icon: DescriptionIcon,
            path: "view/json",
            element: <JsonItemView/>,
          },
          {
            name: "Json-Item-Config",
            icon: SettingsIcon,
            path: "view/json/conifg",
            element: <JsonItemConfig/>,
          },
        ]
      },
    ]
  },
  {
    path: "*",
    element: <Navigate replace to="/app" />
  },
]

export const AppRouters = () => {
  let element = useRoutes(routers);
  return element;
}


const createRouterPropsMap = (routers, parentPath = "") => {
  let map = {}
  routers.forEach(router => {
    const path = `${parentPath}${router.path}`
    if (router.name) {
      map[path] = {
        name: router.name,
        icon: router.icon
      };
    }
    if (router.children) {
      Object.assign(map, createRouterPropsMap(router.children, path == "/" ? path : path + "/"))
    }
  });
  return map;
}

export const routerPropsMap = createRouterPropsMap(routers, "");