// import { useEffect, useState } from 'react';
// import { User, Session } from '@supabase/supabase-js';
// import { supabase } from '@/integrations/supabase/client';
// import { useNavigate } from 'react-router-dom';

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [session, setSession] = useState<Session | null>(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Set up auth state listener FIRST
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (event, session) => {
//         setSession(session);
//         setUser(session?.user ?? null);
//         setLoading(false);
//       }
//     );

//     // THEN check for existing session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const signOut = async () => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
//       setUser(null);
//       setSession(null);
//       navigate('/auth');
//     } catch (error) {
//       console.error('Sign out error:', error);
//       // Force navigation even if sign out fails
//       setUser(null);
//       setSession(null);
//       navigate('/auth');
//     }
//   };

//   return { user, session, loading, signOut };
// };



//OLD ONE IS UP
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ===================== TYPES ===================== */
type DoctorAuthProfile = {
  doctor_id: string;
  name?: string;
  email?: string;
  specialization?: string;
};

type DoctorClinic = {
  clinic_id: string;
  clinic_name: string;
};

/* ===================== HOOK ===================== */
export const useAuth = () => {
  const [doctor, setDoctor] = useState<DoctorAuthProfile | null>(null);
  const [clinics, setClinics] = useState<DoctorClinic[]>([]);
  const [activeClinic, setActiveClinic] = useState<DoctorClinic | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ===================== HELPER: Safe JSON Parse ===================== */
  const safeParse = <T,>(value: string | null): T | null => {
    if (!value || value === "undefined") return null;
    try {
      return JSON.parse(value) as T;
    } catch (err) {
      console.error("Failed to parse JSON from localStorage", err);
      return null;
    }
  };

  /* ===================== INIT ===================== */
  useEffect(() => {
    const storedDoctor = safeParse<DoctorAuthProfile>(
      localStorage.getItem("doctor_profile")
    );
    const storedClinics =
      safeParse<DoctorClinic[]>(localStorage.getItem("doctor_clinics")) || [];
    const storedActiveClinic = safeParse<DoctorClinic>(
      localStorage.getItem("active_clinic")
    );

    if (storedDoctor) {
      setDoctor(storedDoctor);
      setClinics(storedClinics);
      setActiveClinic(storedActiveClinic || storedClinics[0] || null);
    }

    setLoading(false);
  }, []);

  /* ===================== LOGIN ===================== */
  const login = (data: { doctor: DoctorAuthProfile; clinics: DoctorClinic[] }) => {
    localStorage.setItem("doctor_profile", JSON.stringify(data.doctor));
    localStorage.setItem("doctor_clinics", JSON.stringify(data.clinics));

    const defaultClinic = data.clinics[0] || null;
    if (defaultClinic) {
      localStorage.setItem("active_clinic", JSON.stringify(defaultClinic));
    }

    setDoctor(data.doctor);
    setClinics(data.clinics);
    setActiveClinic(defaultClinic);

    // Redirect to /home
    navigate("/dashboard", { replace: true });
  };

  /* ===================== CLINIC SWITCH ===================== */
  const switchClinic = (clinic: DoctorClinic) => {
    localStorage.setItem("active_clinic", JSON.stringify(clinic));
    setActiveClinic(clinic);
  };

  /* ===================== LOGOUT ===================== */
  const logout = () => {
    localStorage.removeItem("doctor_profile");
    localStorage.removeItem("doctor_clinics");
    localStorage.removeItem("active_clinic");

    setDoctor(null);
    setClinics([]);
    setActiveClinic(null);

    navigate("/auth");
  };

  /* ===================== RETURN ===================== */
  return {
    doctor,
    clinics,
    activeClinic,
    loading,
    isAuthenticated: !!doctor,
    login,
    logout,
    switchClinic,
  };
};
