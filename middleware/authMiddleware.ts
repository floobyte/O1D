import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';

const SECRET_KEY = process.env.SECRET_KEY || '1234';

export const authMiddleware = async (req: Request, roles: string[]) => {
  const cookieHeader = req.headers.get('cookie');
  // console.log({cookieHeader})
  if (!cookieHeader) {
    console.log("Cookie header is missing!");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const cookies = cookie.parse(cookieHeader);
  // console.log({cookies});
  const token = cookies.token;
  // console.log({token});
  if (!token) {
    console.log("Token is missing in cookies!");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, SECRET_KEY) as {id: string, role: string };
    console.log({decoded});
    
    // Check if the user's role is authorized
    if (!roles.includes(decoded.role)) {
      return NextResponse.json({ message: "Contact to Admin!" }, { status: 403 });
    }

    (req as any).user = {
      id: decoded.id,
      role: decoded.role,
    };

    // Return undefined to allow access to the main route handler
    return undefined;
  } catch (error) {
    console.log("Token verification failed:", error);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
};


// import { NextResponse } from "next/server";
// import jwt from 'jsonwebtoken';

// const SECRET_KEY = process.env.SECRET_KEY || '1234';

// export const authMiddleware = async (req: Request, roles: string[]) => {

//   const authHeader = req.headers.get('Authorization');
//   // console.log("Auth header: ", authHeader);
//   // console.log("Request Headers: ", req.headers);


//   if(!authHeader){
//     console.log("Authorizztion header missing!");
//     return NextResponse.json({message: "Unauthorised"}, {status: 401});
//   }

//   const token = authHeader.trim().split(" ")[1];
//   // console.log({token});

//   if (!token) {
//         console.log("Token is missing or empty");
//         return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//       }

//       try {
//             // Verify the JWT token
//             const decoded = jwt.verify(token, SECRET_KEY) as { role: string };
        
//             // Check if the user's role is authorized
//             if (!roles.includes(decoded.role)) {
//               return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
//             }
        
//             // Return undefined if authorized to proceed to the main logic
//             return undefined;
//           } catch (error) {
//             console.log("Token verification failed:", error);
//             return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//           }

// }

