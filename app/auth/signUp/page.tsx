"use client";
import React, { useState } from "react";
import { createUser } from "@/app/services/api";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/solid";


interface SignUpProps {
  onUserAdded: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPass: "",
    dob: "",
    phone: "",
    username: "",
    account: "",
    IFSC: "",
    referralCode: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const { toast } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData);
      toast({
        title: "User created successfully",
        description: new Date().toString(),
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPass: "",
        dob: "",
        phone: "",
        username: "",
        account: "",
        IFSC: "",
        referralCode: "",
      });
      // onUserAdded();
      setIsModalVisible(true);

      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);

    } catch (err) {
      setError("Failed to create user");
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    router.push('/auth/login');
  }

  return (
    <section className="w-full h-screen mt-36 flex justify-center items-center">
      <div className="space-y-4 sm:border sm:rounded-xl sm:p-8 sm:shadow-xl bg-slate-100 dark:bg-slate-950 max-w-lg mx-auto">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Register here</h1>
         
        </div>
        <form className="space-y-4 w-80" onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Name"
            onChange={handleChange}
            className="bg-slate-100 dark:bg-slate-950"
            required
          />
          <Input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            className="bg-slate-100 dark:bg-slate-950"
            required
          />
          <Input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
            className="bg-slate-100 dark:bg-slate-950"
            required
          />
          <Input
            type="password"
            name="confirmPass"
            value={formData.confirmPass}
            placeholder="Confirm Password"
            onChange={handleChange}
            className="bg-slate-100 dark:bg-slate-950"
            required
          />

          <Input
            type="date"
            name="dob"
            value={formData.dob}
            placeholder="DOB"
            onChange={handleChange}
            className="bg-slate-950 text-white pr-10" // Add padding to ensure text doesn't overlap the icon
            required
            style={{
              colorScheme: "dark", // Ensures proper color in some browsers
            }}
          />

          <Input
            type="number"
            name="phone"
            value={formData.phone}
            placeholder="Phone"
            onChange={handleChange}
            className="bg-slate-100 dark:bg-slate-950"
            required
          />
          <Input
            type="text"
            name="username"
            value={formData.username}
            placeholder="Username"
            onChange={handleChange}
            className="bg-slate-100 dark:bg-slate-950"
            required
          />
          <Input
            type="number"
            name="account"
            value={formData.account}
            placeholder="Account Number"
            onChange={handleChange}
            className="bg-slate-100 dark:bg-slate-950"
            required
          />
          <Input
            type="text"
            name="IFSC"
            value={formData.IFSC}
            placeholder="IFSC"
            onChange={handleChange}
            className="bg-slate-100 dark:bg-slate-950"
            required
          />
          <Input
            type="text"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleChange}
            placeholder="Referral Code"
            className="bg-slate-100 dark:bg-slate-950"
          />
          <Button className="w-full bg-gradient-to-br hover:shadow-md hover:bg-gradient-to-tl hover:from-indigo-500 hover:to-purple-700 ring-2 dark:ring-indigo-800 ring-indigo-300 from-indigo-500 to-purple-700 text-white " type="submit">
            Register
          </Button>
          {error && <p className="text-red-500 text-sm">Email,username and Phone Number should be unique {error}</p>}
        </form>
      </div>

      {/* Add PopUp */}

      {isModalVisible && (
        <div id="static-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-100 max-w-lg w-full sm:m-0 m-6">
            <div className="flex items-center  justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-900">
                Registration Successfully
              </h3>
              <button onClick={handleModalClose} className="text-gray-700 bg-transparent hover:bg-gray-200 rounded-lg text-sm p-1.5 dark:hover:bg-red-600">
                <span className="sr-only">Close</span>
                &#10005;
              </button>
            </div>
            <div className="p-4 text-gray-600 dark:text-gray-300">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg text-gray-800 dark:text-gray-900">
                Thank you for registering! You will now be redirected to the login page.
              </p>
            </div>
            <div className="flex justify-end p-4 border-t dark:border-gray-600">
              <Button onClick={handleModalClose} className="bg-blue-700 hover:bg-blue-800 text-white">
                Proceed to Login
              </Button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default SignUp;












// "use client";
// import React, { useState } from "react";
// import { createUser } from "@/app/services/api";
// import { Input } from "@/app/components/ui/input";
// import { Button } from "@/app/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { useRouter } from "next/navigation";
// import { CheckCircleIcon } from "@heroicons/react/24/solid";

// interface SignUpProps {
//   onUserAdded: () => void;
// }

// const SignUp: React.FC<SignUpProps> = ({ onUserAdded }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPass: "",
//     dob: "",
//     phone: "",
//     username: "",
//     referralCode: "",
//   });
//   const [error, setError] = useState<string | null>(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const { toast } = useToast();
//   const router = useRouter();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Validation for referralCode
//     if (!formData.referralCode.trim()) {
//       setError("Referral code is required");
//       setIsModalVisible(true);
//       return;
//     }

//     try {
//       await createUser(formData);
//       toast({
//         title: "User created successfully",
//         description: new Date().toString(),
//       });

//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         confirmPass: "",
//         dob: "",
//         phone: "",
//         username: "",
//         referralCode: "",
//       });

//       setError(null);
//       setIsModalVisible(true);

//       setTimeout(() => {
//         router.push("/auth/login");
//       }, 3000);
//     } catch (err) {
//       setError("Failed to create user");
//     }
//   };

//   const handleModalClose = () => {
//     setIsModalVisible(false);
//     if (!error) {
//       router.push("/auth/login");
//     }
//   };

//   return (
//     <section className="w-full h-screen mt-24 flex justify-center items-center">
//       <div className="space-y-4 sm:border sm:rounded-xl sm:p-8 sm:shadow-xl bg-slate-100 dark:bg-slate-950 max-w-lg mx-auto">
//         <div className="space-y-1 text-center">
//           <h1 className="text-2xl font-bold">Register here</h1>
//           {error && <p className="text-red-500 text-sm">{error}</p>}
//         </div>
//         <form className="space-y-4 w-80" onSubmit={handleSubmit}>
//           <Input
//             type="text"
//             name="name"
//             value={formData.name}
//             placeholder="Name"
//             onChange={handleChange}
//             className="bg-slate-100 dark:bg-slate-950"
//             required
//           />
//           <Input
//             type="email"
//             name="email"
//             value={formData.email}
//             placeholder="Email"
//             onChange={handleChange}
//             className="bg-slate-100 dark:bg-slate-950"
//             required
//           />
//           <Input
//             type="password"
//             name="password"
//             value={formData.password}
//             placeholder="Password"
//             onChange={handleChange}
//             className="bg-slate-100 dark:bg-slate-950"
//             required
//           />
//           <Input
//             type="password"
//             name="confirmPass"
//             value={formData.confirmPass}
//             placeholder="Confirm Password"
//             onChange={handleChange}
//             className="bg-slate-100 dark:bg-slate-950"
//             required
//           />
//           <Input
//             type="date"
//             name="dob"
//             value={formData.dob}
//             placeholder="DOB"
//             onChange={handleChange}
//             className="bg-slate-950 text-white pr-10"
//             required
//             style={{
//               colorScheme: "dark",
//             }}
//           />
//           <Input
//             type="text"
//             name="phone"
//             value={formData.phone}
//             placeholder="Phone"
//             onChange={handleChange}
//             className="bg-slate-100 dark:bg-slate-950"
//             required
//           />
//           <Input
//             type="text"
//             name="username"
//             value={formData.username}
//             placeholder="Username"
//             onChange={handleChange}
//             className="bg-slate-100 dark:bg-slate-950"
//             required
//           />
//           <Input
//             type="text"
//             name="referralCode"
//             value={formData.referralCode}
//             onChange={handleChange}
//             placeholder="Referral Code"
//             className="bg-slate-100 dark:bg-slate-950"
//           />
//           <Button
//             className="w-full bg-gradient-to-br hover:shadow-md hover:bg-gradient-to-tl hover:from-indigo-500 hover:to-purple-700 ring-2 dark:ring-indigo-800 ring-indigo-300 from-indigo-500 to-purple-700 text-white"
//             type="submit"
//           >
//             Register
//           </Button>
//         </form>
//       </div>

//       {/* Modal */}
//       {isModalVisible && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="relative bg-white rounded-lg shadow dark:bg-gray-100 max-w-lg w-full sm:m-0 m-6">
//             <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
//               <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-900">
//                 {error ? "Error" : "Registration Successful"}
//               </h3>
//               <button
//                 onClick={handleModalClose}
//                 className="text-gray-700 bg-transparent hover:bg-gray-200 rounded-lg text-sm p-1.5 dark:hover:bg-red-600"
//               >
//                 <span className="sr-only">Close</span>
//                 &#10005;
//               </button>
//             </div>
//             <div className="p-4 text-gray-600 dark:text-gray-300">
//               {error ? (
//                 <p className="text-lg text-red-600 dark:text-red-700">{error}</p>
//               ) : (
//                 <>
//                   <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
//                   <p className="text-lg text-gray-800 dark:text-gray-900">
//                     Thank you for registering! You will now be redirected to the login page.
//                   </p>
//                 </>
//               )}
//             </div>
//             <div className="flex justify-end p-4 border-t dark:border-gray-600">
//               <Button
//                 onClick={handleModalClose}
//                 className={
//                   error
//                     ? "bg-red-700 hover:bg-red-800 text-white"
//                     : "bg-blue-700 hover:bg-blue-800 text-white"
//                 }
//               >
//                 {error ? "Close" : "Proceed to Login"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default SignUp;
