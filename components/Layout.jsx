import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MobileTabBar from "@/components/MobileTabBar";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useBiometric } from "@/hooks/useBiometric";
import LocationPrompt from "@/components/LocationPrompt";
import BiometricGate from "@/components/BiometricGate";

const PROMPT_KEY = "cp_loc_prompted";
const BIO_KEY = "cp_bio_unlocked";

export default function Layout() {
  const { location, status, request } = useUserLocation();
  const { enabled: bioEnabled } = useBiometric();
  const [showPrompt, setShowPrompt] = useState(false);
  const [bioUnlocked, setBioUnlocked] = useState(
    () => sessionStorage.getItem(BIO_KEY) === "1"
  );

  useEffect(() => {
    if (!location && sessionStorage.getItem(PROMPT_KEY) !== "1") {
      setShowPrompt(true);
    }
  }, [location]);

  const handleAllow = async () => {
    sessionStorage.setItem(PROMPT_KEY, "1");
    setShowPrompt(false);
    await request();
  };

  const handleDismiss = () => {
    sessionStorage.setItem(PROMPT_KEY, "1");
    setShowPrompt(false);
  };

  const handleBioUnlock = () => {
    sessionStorage.setItem(BIO_KEY, "1");
    setBioUnlocked(true);
  };

  const showBioGate = bioEnabled && !bioUnlocked;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col min-h-0">
        <Outlet context={{ userLocation: location, locationStatus: status }} />
      </main>
      <MobileTabBar />
      {showPrompt && (
        <LocationPrompt
          onAllow={handleAllow}
          onDismiss={handleDismiss}
          requesting={status === "requesting"}
        />
      )}
      {showBioGate && <BiometricGate onUnlock={handleBioUnlock} onDisable={handleBioUnlock} />}
    </div>
  );
}