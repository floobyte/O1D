import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
// import Cookies from 'js-cookie';

type ProtectedAuthProps = {
    role: ('admin' | 'user')[]
}

export function authRouter<T extends object>(Component: React.ComponentType<T>, allowedRole: ProtectedAuthProps['role']){
    return function AuthWrapper(props: T) {
        const router = useRouter();

        useEffect(() => {
            
            // const token = document.cookie.split('; ')
            // .find((row) => row.startsWith('token='))?.split('=')[1];
            // // const token = Cookies.get('authToken');

            // if(!token){
            //     router.replace('/auth/login');
            // }

            const role = document.cookie.split('; ').find((row) => row.startsWith('role='))?.split('=')[1];

            if(!role){
                router.replace('auth/login');
            }

            if(!allowedRole.includes(role as 'admin' | 'user')){
                router.replace('auth/unautherized');
            }
        },[router])

        return <Component {...props} />
    };
}