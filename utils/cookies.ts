
import { NextResponse } from 'next/server';
import * as cookie from 'cookie';

export const setTokenCookie = (res: NextResponse, token: string, role: string) => {
  const cookieOptions = {
    httpOnly: true, // Ensures cookie can't be accessed via JavaScript
    secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
    maxAge: 60 * 60 * 24 * 7, // Set cookie expiration (7 days here)
    sameSite: 'strict' as const, // Helps prevent CSRF attacks
    path: '/', // Path for which the cookie is valid
  };

  // Set the cookie in the response header
  res.headers.set(
    'Set-Cookie',
    cookie.serialize('token', token, cookieOptions)
  );

  res.cookies.set('role', role, { 
    httpOnly: false, 
    sameSite: 'strict',
    path: '/'
  });

};


// import { NextResponse } from 'next/server';
// import * as cookie from 'cookie';

// export const setTokenCookie = (res: NextResponse, token: string) => {
//   const cookieOptions = {
//     httpOnly: true, // Ensures cookie can't be accessed via JavaScript
//     secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
//     maxAge: 60 * 60 * 24 * 7, // Set cookie expiration (7 days here)
//     sameSite: 'strict' as const, // Helps prevent CSRF attacks
//     path: '/', // Path for which the cookie is valid
//   };

//   // Set the cookie in the response header
//   res.headers.set(
//     'Set-Cookie',
//     cookie.serialize('token', token, cookieOptions)
//   );
// };
