
import { Typography } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

import {
    Link as RouterLink, useLocation,
} from 'react-router-dom';
import { routerPropsMap } from '../../../routers';



const BreadCrumbsNav = () => {

    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);
    const LinkRouter = (props) => <Link {...props} component={RouterLink} />;

    const breadcrumbs = pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        return routerPropsMap.hasOwnProperty(to) ? to : null;
    })
        .filter(path => path != null)
        .map((path, index, paths) => {
            const name = routerPropsMap[path].name;
            const Icon = routerPropsMap[path].icon;
            return paths.length - 1 === index ? (
                <Typography color="white" key={path} sx={{ display: 'flex', alignItems: 'center' }}>
                    {Icon && <Icon sx={{ mr: 0.5 }} fontSize="inherit" />}
                    {name}
                </Typography>
            ) : (
                <LinkRouter underline="hover" color="white" sx={{ display: 'flex', alignItems: 'center' }} to={path} key={path}>
                    {Icon && <Icon sx={{ mr: 0.5 }} fontSize="inherit" />}
                    {name}
                </LinkRouter>
            );
        });

    return (
        <div role="presentation">
            <Breadcrumbs aria-label="breadcrumb" color="white">
                {breadcrumbs}
            </Breadcrumbs>
        </div>
    )
}
export default BreadCrumbsNav;