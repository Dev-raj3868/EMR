// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import Logo from "@/components/Logo";
// import { toast } from "sonner";
// import { supabase } from "@/integrations/supabase/client";
// import { Eye, EyeOff } from "lucide-react";
// import { useAuth } from "@/hooks/useAuth";

// const Auth = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [clinicName, setClinicName] = useState("");
//   const [shift, setShift] = useState("");
//   const [phone, setPhone] = useState("");
//   const [specialization, setSpecialization] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("login");
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   useEffect(() => {
//     if (user) {
//       navigate("/dashboard");
//     }
//   }, [user, navigate]);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const { error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) throw error;

//       toast.success("Login successful!");
//       navigate("/dashboard");
//     } catch (error: any) {
//       toast.error(error.message || "Login failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!fullName || !clinicName || !shift) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const redirectUrl = `${window.location.origin}/dashboard`;
      
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           emailRedirectTo: redirectUrl,
//           data: {
//             full_name: fullName,
//             clinic_name: clinicName,
//             shift: shift,
//             phone: phone,
//             specialization: specialization,
//           }
//         }
//       });

//       if (error) throw error;

//       if (data.user) {
//         const { error: profileError } = await supabase
//           .from('profiles')
//           .insert({
//             id: data.user.id,
//             email: data.user.email!,
//             full_name: fullName,
//             clinic_name: clinicName,
//             shift: shift,
//             phone: phone || null,
//             specialization: specialization || null,
//           });

//         if (profileError) throw profileError;

//         toast.success("Account created successfully!");
//         navigate("/dashboard");
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Signup failed");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleForgotPassword = async () => {
//     if (!email) {
//       toast.error("Please enter your email address");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const { error } = await supabase.auth.resetPasswordForEmail(email, {
//         redirectTo: `${window.location.origin}/auth`,
//       });

//       if (error) throw error;

//       toast.success("Password reset email sent! Check your inbox.");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to send reset email");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/5 to-background p-4 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 opacity-30">
//         <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
//         <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
//       </div>
      
//       <Card className="w-full max-w-md border-border shadow-elevated backdrop-blur-sm bg-card/95 animate-fade-in relative z-10">
//         <CardHeader className="space-y-4 text-center">
//           <div className="flex justify-center">
//             <Logo className="w-32 h-32 object-contain" />
//           </div>
//           <div>
//             <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//               Nexus
//             </CardTitle>
//             <CardDescription className="text-base mt-2">
//               Hospital Management System
//             </CardDescription>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <Tabs value={activeTab} onValueChange={setActiveTab}>
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="login">Login</TabsTrigger>
//               <TabsTrigger value="signup">Sign Up</TabsTrigger>
//             </TabsList>
            
//             <TabsContent value="login">
//               <form onSubmit={handleLogin} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="login-email">Email</Label>
//                   <Input
//                     id="login-email"
//                     type="email"
//                     placeholder="doctor@hospital.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="bg-background"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="login-password">Password</Label>
//                   <div className="relative">
//                     <Input
//                       id="login-password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="••••••••"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                       className="bg-background pr-10"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                     >
//                       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </button>
//                   </div>
//                 </div>
//                 <Button
//                   type="submit"
//                   className="w-full bg-primary hover:bg-primary-dark"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Logging in..." : "Login"}
//                 </Button>
//                 <div className="text-center">
//                   <button
//                     type="button"
//                     onClick={handleForgotPassword}
//                     className="text-sm text-primary hover:underline"
//                   >
//                     Forgot password?
//                   </button>
//                 </div>
//               </form>
//             </TabsContent>
            
//             <TabsContent value="signup">
//               <form onSubmit={handleSignup} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="signup-name">Full Name *</Label>
//                   <Input
//                     id="signup-name"
//                     type="text"
//                     placeholder="Dr. John Doe"
//                     value={fullName}
//                     onChange={(e) => setFullName(e.target.value)}
//                     required
//                     className="bg-background"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="signup-email">Email *</Label>
//                   <Input
//                     id="signup-email"
//                     type="email"
//                     placeholder="doctor@hospital.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className="bg-background"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="signup-password">Password *</Label>
//                   <div className="relative">
//                     <Input
//                       id="signup-password"
//                       type={showPassword ? "text" : "password"}
//                       placeholder="••••••••"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                       className="bg-background pr-10"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                     >
//                       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </button>
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="signup-clinic">Clinic Name *</Label>
//                   <Input
//                     id="signup-clinic"
//                     type="text"
//                     placeholder="City General Hospital"
//                     value={clinicName}
//                     onChange={(e) => setClinicName(e.target.value)}
//                     required
//                     className="bg-background"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="signup-shift">Shift *</Label>
//                   <Input
//                     id="signup-shift"
//                     type="text"
//                     placeholder="Morning / Evening / Night"
//                     value={shift}
//                     onChange={(e) => setShift(e.target.value)}
//                     required
//                     className="bg-background"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="signup-phone">Phone</Label>
//                   <Input
//                     id="signup-phone"
//                     type="tel"
//                     placeholder="+1234567890"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     className="bg-background"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="signup-specialization">Specialization</Label>
//                   <Input
//                     id="signup-specialization"
//                     type="text"
//                     placeholder="Cardiology"
//                     value={specialization}
//                     onChange={(e) => setSpecialization(e.target.value)}
//                     className="bg-background"
//                   />
//                 </div>
//                 <Button
//                   type="submit"
//                   className="w-full bg-primary hover:bg-primary-dark"
//                   disabled={isLoading}
//                 >
//                   {isLoading ? "Creating account..." : "Sign Up"}
//                 </Button>
//               </form>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Auth;




import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "@/components/Logo";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

/* API Services */
import {
  searchDoctorProfile,
  createDoctorAuthEMR,
  loginDoctor,
} from "@/services/doctorauth";

type DoctorProfile = { doctor_id: string; name?: string };
type Clinic = { clinic_id: string; clinic_name: string };

const Auth = () => {
  const { login } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  const [doctorId, setDoctorId] = useState("");
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [clinics, setClinics] = useState<Clinic[]>([]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ---------------- LOGIN ---------------- */
  const handleLogin = async () => {
    if (!doctorId || !password) {
      toast.error("Doctor ID and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await loginDoctor({ doctor_id: doctorId, password });

      if (res.apiSuccess === 1 && res.resSuccess === 1) {
        const profile = { doctor_id: res.doctor_id, name: res.doctor_name };
        login({ doctor: profile, clinics: res.clinics || [] });
        toast.success("Login successful");
      } else {
        toast.error(res.message || "Invalid credentials");
      }
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SIGN UP: VERIFY DOCTOR ---------------- */
const handleVerifyDoctor = async () => {
  if (!doctorId) return toast.error("Please enter Doctor ID");

  try {
    setLoading(true);
    const res = await searchDoctorProfile({ doctor_id: doctorId });

    // ✅ Check apiSuccess instead of res.doctor
    if (res.apiSuccess !== 1) return toast.error("Doctor ID not found");

    // ✅ Set doctorProfile from root fields
    setDoctorProfile({
      doctor_id: res.doctor_id,
      name: res.doctor_name,
    });

    setClinics(res.clinics || []);
    toast.success("Doctor verified");
  } catch {
    toast.error("Doctor ID not found");
  } finally {
    setLoading(false);
  }
};


  /* ---------------- SIGN UP: CREATE PASSWORD ---------------- */
  const handleCreatePassword = async () => {
    if (!password || password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      await createDoctorAuthEMR({ doctor_id: doctorId, password });
      toast.success("Password created successfully");
      setMode("login"); // go to login after creating password
      setPassword("");
      setConfirmPassword("");
      setDoctorProfile(null);
    } catch {
      toast.error("Failed to create password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/5 to-background p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <Card className="w-full max-w-md shadow-elevated backdrop-blur-sm bg-card/95 relative z-10">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo className="w-28 h-28" />
          </div>

          <CardTitle className="text-2xl font-bold">
            {mode === "login"
              ? "Doctor Login"
              : doctorProfile
              ? "Doctor Access"
              : "Sign Up"}
          </CardTitle>

          <CardDescription className="space-y-1">
            {mode === "login" ? (
              <>
               
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-sm text-primary hover:underline block mt-1"
                >
                  New here? Sign Up
                </button>
              </>
            ) : !doctorProfile ? (
              <>
                Verify your Doctor ID
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-sm text-muted-foreground hover:underline block mt-1"
                >
                  Already have an account? Login here
                </button>
              </>
            ) : (
              <>
                Create your login password
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-sm text-muted-foreground hover:underline block mt-1"
                >
                  Already have an account? Login here
                </button>
              </>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {mode === "login" && (
            <>
              <div className="space-y-2">
                <Label>Doctor ID</Label>
                <Input
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value.toUpperCase())}
                  placeholder="Enter your ID"
                />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <Button className="w-full" onClick={handleLogin} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </>
          )}

          {mode === "signup" && !doctorProfile && (
            <>
              <div className="space-y-2">
                <Label>Doctor ID</Label>
                <Input
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value.toUpperCase())}
                  placeholder="Enter your ID"
                />
              </div>

              <Button
                className="w-full"
                onClick={handleVerifyDoctor}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Doctor"}
              </Button>
            </>
          )}

          {mode === "signup" && doctorProfile && (
            <>
              <div className="text-sm text-muted-foreground">
                Doctor Verified: <b>{doctorProfile.name || doctorProfile.doctor_id}</b>
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleCreatePassword}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Doctor"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
