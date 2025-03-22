import { ROUTES } from '@constants/ROUTES';
import { memo } from 'react';
import NavLink from './NavLink';

interface NavbarLinksProps {
    pathname: string;
}

const NavbarLinks = ({ pathname }: NavbarLinksProps) => {
    return (
        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
            <NavLink
                href={ROUTES.DASHBOARD()}
                isActive={pathname === ROUTES.DASHBOARD()}
                icon="dashboard"
            >
                Dashboard
            </NavLink>
            <NavLink
                href={ROUTES.LANGUAGES()}
                isActive={pathname.startsWith('/languages')}
                icon="languages"
            >
                Idiomas
            </NavLink>
            <NavLink
                href={ROUTES.PROFILE()}
                isActive={pathname === ROUTES.PROFILE()}
                icon="profile"
            >
                Perfil
            </NavLink>
        </nav>
    );
};

export default memo(NavbarLinks);
