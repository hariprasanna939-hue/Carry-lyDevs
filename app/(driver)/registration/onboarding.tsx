import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../../src/theme/colors";
import Button from "../../../src/components/ui/Button";
import Input from "../../../src/components/ui/Input";
import OnboardingProgressBar from "../../../src/components/driver/OnboardingProgressBar";
import DocumentUploader from "../../../src/components/driver/DocumentUploader";
import CoimbatoreAreaPicker from "../../../src/components/driver/CoimbatoreAreaPicker";
import { useAuth } from "../../../src/hooks/useAuth";
import { driverOnboardingService } from "../../../src/services/driver-onboarding.service";
import {
  COIMBATORE_LOCALITIES,
  COIMBATORE_VEHICLE_ONBOARDING_CATEGORIES,
} from "../../../src/constants/coimbatore-areas";
import {
  DriverApplicationRecord,
  IdentityDocType,
  RegisteredVehicle,
  VehicleCategoryKey,
  VehicleOwnershipType,
} from "../../../src/types/driver-onboarding";

const STEP_TITLES = [
  "Mobile Verification",
  "Personal Information",
  "Profile Photograph",
  "Identity Verification",
  "Driving Licence Details",
  "Vehicle Category",
  "Vehicle Information",
  "Vehicle Documents",
  "Bank Payout Details",
  "Operating Localities",
  "Helper Preferences",
  "Review & Submit",
];

export default function DriverOnboardingWizard() {
  const router = useRouter();
  const { user } = useAuth();
  const uid = user?.uid || "guest_driver";

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Master Application State
  const [appData, setAppData] = useState<DriverApplicationRecord>({
    applicationId: `APP-${uid.slice(0, 8).toUpperCase()}`,
    driverUid: uid,
    currentStep: 1,
    status: "DRAFT",
    lastUpdatedDate: new Date().toISOString(),
    referenceNumber: `CARRY-DRV-${new Date().getFullYear()}-${uid.slice(0, 4).toUpperCase()}`,
    driverApproval: "pending",
    vehicleApproval: "pending",
    bankVerification: "pending",
    vehicles: [],
    correctionItems: [],
    declarationAccepted: false,
    termsAccepted: false,
  });

  // Step 1: Phone & OTP State
  const [phoneNumber, setPhoneNumber] = useState(user?.phone?.replace("+91", "") || "");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(!!user?.phone);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Step 2: Personal Details State
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [dob, setDob] = useState("1992-05-15");
  const [gender, setGender] = useState<"male" | "female" | "other" | "prefer_not_to_say">("male");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("Gandhipuram");
  const [city, setCity] = useState("Coimbatore");
  const [district, setDistrict] = useState("Coimbatore");
  const [state, setState] = useState("Tamil Nadu");
  const [pinCode, setPinCode] = useState("641012");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("Spouse");

  // Step 3: Profile Photo
  const [profilePhotoUri, setProfilePhotoUri] = useState<string>("");

  // Step 4: Identity Verification
  const [identityType, setIdentityType] = useState<IdentityDocType>("aadhaar");
  const [nameOnDoc, setNameOnDoc] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [identityFrontUri, setIdentityFrontUri] = useState<string>("");
  const [identityBackUri, setIdentityBackUri] = useState<string>("");

  // Step 5: Driving Licence
  const [licenceNumber, setLicenceNumber] = useState("");
  const [nameOnLicence, setNameOnLicence] = useState("");
  const [licenceDob, setLicenceDob] = useState("");
  const [licenceIssueDate, setLicenceIssueDate] = useState("2020-01-10");
  const [licenceExpiryDate, setLicenceExpiryDate] = useState("2035-01-10");
  const [issuingRTO, setIssuingRTO] = useState("TN-38 Coimbatore South");
  const [licenceClass, setLicenceClass] = useState("LMV-TR (Transport)");
  const [licenceFrontUri, setLicenceFrontUri] = useState<string>("");
  const [licenceBackUri, setLicenceBackUri] = useState<string>("");

  // Step 6: Vehicle Category Selection
  const [selectedVehicleCategory, setSelectedVehicleCategory] = useState<VehicleCategoryKey>("tata_ace");

  // Step 7: Vehicle Information
  const [vehicleRegNumber, setVehicleRegNumber] = useState("");
  const [vehicleMake, setVehicleMake] = useState("Tata");
  const [vehicleModel, setVehicleModel] = useState("Ace Gold");
  const [vehicleYear, setVehicleYear] = useState("2022");
  const [vehicleColor, setVehicleColor] = useState("White");
  const [vehicleFuel, setVehicleFuel] = useState<"diesel" | "petrol" | "cng" | "electric">("diesel");
  const [vehicleBody, setVehicleBody] = useState<"open_top" | "closed_container" | "tarpaulin" | "flatbed">("open_top");
  const [registeredOwner, setRegisteredOwner] = useState("");
  const [ownershipType, setOwnershipType] = useState<VehicleOwnershipType>("self");

  // Step 8: Vehicle Documents
  const [rcFrontUri, setRcFrontUri] = useState<string>("");
  const [insuranceUri, setInsuranceUri] = useState<string>("");
  const [insuranceExpiry, setInsuranceExpiry] = useState("2027-04-30");
  const [fitnessUri, setFitnessUri] = useState<string>("");
  const [permitUri, setPermitUri] = useState<string>("");
  const [ownerAuthUri, setOwnerAuthUri] = useState<string>("");

  // Step 9: Bank Details
  const [bankHolderName, setBankHolderName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankConfirmAccountNumber, setBankConfirmAccountNumber] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankBranch, setBankBranch] = useState("");

  // Step 10: Service Preferences
  const [primaryArea, setPrimaryArea] = useState("Gandhipuram (Central Hub)");
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>([
    "Gandhipuram (Central Hub)",
    "RS Puram",
    "Peelamedu & Hopes College",
    "Singanallur & Trichy Road",
  ]);
  const [preferredWorkingHours, setPreferredWorkingHours] = useState<"morning" | "evening" | "full_day" | "flexible">("full_day");

  // Step 11: Helper Preferences
  const [providesHelpers, setProvidesHelpers] = useState<"yes" | "no" | "conditional">("yes");
  const [helperCount, setHelperCount] = useState<number>(1);
  const [helperRateRs, setHelperRateRs] = useState<string>("250");
  const [helperNotes, setHelperNotes] = useState("");

  // Step 12: Declaration & Terms
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Load saved draft on mount
  useEffect(() => {
    async function initDraft() {
      try {
        const saved = await driverOnboardingService.getDriverApplication(uid);
        setAppData(saved);

        if (saved.currentStep && saved.currentStep >= 1 && saved.currentStep <= 12) {
          setCurrentStep(saved.currentStep);
        }

        if (saved.personalDetails) {
          setFullName(saved.personalDetails.fullName || "");
          setDob(saved.personalDetails.dob || "");
          setGender(saved.personalDetails.gender || "male");
          setAlternatePhone(saved.personalDetails.alternatePhone || "");
          setHouseNo(saved.personalDetails.houseNo || "");
          setStreet(saved.personalDetails.street || "");
          setArea(saved.personalDetails.area || "Gandhipuram");
          setPinCode(saved.personalDetails.pinCode || "641012");
          setEmergencyName(saved.personalDetails.emergencyContactName || "");
          setEmergencyPhone(saved.personalDetails.emergencyContactPhone || "");
          setEmergencyRelation(saved.personalDetails.emergencyContactRelation || "Spouse");
        }

        if (saved.profilePhotoUrl) setProfilePhotoUri(saved.profilePhotoUrl);

        if (saved.identityDoc) {
          setIdentityType(saved.identityDoc.docType);
          setNameOnDoc(saved.identityDoc.nameOnDoc || "");
          setDocNumber(saved.identityDoc.docNumberMasked || "");
          setIdentityFrontUri(saved.identityDoc.frontImageUrl || "");
          setIdentityBackUri(saved.identityDoc.backImageUrl || "");
        }

        if (saved.licenceDetails) {
          setLicenceNumber(saved.licenceDetails.licenceNumber || "");
          setNameOnLicence(saved.licenceDetails.nameOnLicence || "");
          setLicenceExpiryDate(saved.licenceDetails.expiryDate || "");
          setLicenceClass(saved.licenceDetails.licenceClass || "LMV-TR");
          setLicenceFrontUri(saved.licenceDetails.frontImageUrl || "");
          setLicenceBackUri(saved.licenceDetails.backImageUrl || "");
        }

        if (saved.vehicles && saved.vehicles.length > 0) {
          const v = saved.vehicles[0];
          setSelectedVehicleCategory(v.category);
          setVehicleRegNumber(v.registrationNumber);
          setVehicleMake(v.make);
          setVehicleModel(v.model);
          setVehicleYear(v.year);
          setVehicleColor(v.color);
          setRegisteredOwner(v.registeredOwnerName);
          setOwnershipType(v.ownershipType);
          setRcFrontUri(v.documents.rcFrontUrl || "");
          setInsuranceUri(v.documents.insuranceUrl || "");
          setInsuranceExpiry(v.documents.insuranceExpiry || "");
        }

        if (saved.bankDetails) {
          setBankHolderName(saved.bankDetails.accountHolderName || "");
          setBankIfsc(saved.bankDetails.ifscCode || "");
          setBankName(saved.bankDetails.bankName || "");
          setBankBranch(saved.bankDetails.branchName || "");
        }

        if (saved.servicePreferences) {
          setPrimaryArea(saved.servicePreferences.primaryArea || "Gandhipuram (Central Hub)");
          setSelectedLocalities(saved.servicePreferences.preferredLocalities || []);
        }

        if (saved.helperPreferences) {
          setProvidesHelpers(saved.helperPreferences.providesHelpers);
          setHelperCount(saved.helperPreferences.helperCount || 1);
          setHelperRateRs(String(Math.round((saved.helperPreferences.helperRatePaise || 25000) / 100)));
        }
      } catch (err) {
        console.log("Draft load error:", err);
      } finally {
        setLoadingInitial(false);
      }
    }
    initDraft();
  }, [uid]);

  // Handle saving after every step
  const persistCurrentProgress = async (stepToSave: number) => {
    try {
      const activeVehicleConfig = COIMBATORE_VEHICLE_ONBOARDING_CATEGORIES.find(
        (c) => c.key === selectedVehicleCategory
      ) || COIMBATORE_VEHICLE_ONBOARDING_CATEGORIES[2];

      const currentVehicle: RegisteredVehicle = {
        id: `VEH-${vehicleRegNumber.replace(/\s+/g, "").toUpperCase() || "TN380001"}`,
        registrationNumber: vehicleRegNumber.trim().toUpperCase(),
        category: selectedVehicleCategory,
        categoryDisplayName: activeVehicleConfig.displayName,
        make: vehicleMake.trim(),
        model: vehicleModel.trim(),
        year: vehicleYear.trim(),
        color: vehicleColor.trim(),
        fuelType: vehicleFuel,
        bodyType: vehicleBody,
        registeredOwnerName: registeredOwner.trim() || fullName.trim(),
        ownershipType,
        payloadCapacityKg: activeVehicleConfig.maxPayloadKg,
        dimensionsFeet: activeVehicleConfig.dimensionsFeet,
        approvalStatus: "pending",
        documents: {
          rcFrontUrl: rcFrontUri,
          insuranceUrl: insuranceUri,
          insuranceExpiry,
          fitnessUrl: fitnessUri,
          permitUrl: permitUri,
          ownerAuthorizationUrl: ownerAuthUri,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const partial: Partial<DriverApplicationRecord> = {
        currentStep: stepToSave,
        personalDetails: {
          fullName: fullName.trim(),
          dob,
          gender,
          verifiedPhone: phoneNumber ? `+91${phoneNumber.trim()}` : user?.phone || "+919876543210",
          alternatePhone: alternatePhone.trim(),
          email: email.trim(),
          houseNo: houseNo.trim(),
          street: street.trim(),
          area: area.trim(),
          city: "Coimbatore",
          district: "Coimbatore",
          state: "Tamil Nadu",
          pinCode: pinCode.trim(),
          emergencyContactName: emergencyName.trim(),
          emergencyContactPhone: emergencyPhone.trim(),
          emergencyContactRelation: emergencyRelation.trim(),
        },
        profilePhotoUrl: profilePhotoUri,
        identityDoc: {
          docType: identityType,
          nameOnDoc: nameOnDoc.trim() || fullName.trim(),
          docNumberMasked: docNumber.trim() ? `XXXX-XXXX-${docNumber.trim().slice(-4)}` : "XXXX-XXXX-1234",
          frontImageUrl: identityFrontUri,
          backImageUrl: identityBackUri,
          verificationStatus: "pending",
        },
        licenceDetails: {
          licenceNumber: licenceNumber.trim().toUpperCase(),
          nameOnLicence: nameOnLicence.trim() || fullName.trim(),
          dob: licenceDob || dob,
          issueDate: licenceIssueDate,
          expiryDate: licenceExpiryDate,
          issuingAuthority: issuingRTO,
          licenceClass,
          frontImageUrl: licenceFrontUri,
          backImageUrl: licenceBackUri,
          isExpired: new Date(licenceExpiryDate) < new Date(),
          verificationStatus: "pending",
        },
        vehicles: [currentVehicle],
        activeVehicleId: currentVehicle.id,
        bankDetails: {
          accountHolderName: bankHolderName.trim() || fullName.trim(),
          accountNumberMasked: bankAccountNumber ? `XXXXXX${bankAccountNumber.trim().slice(-4)}` : "XXXXXX0000",
          ifscCode: bankIfsc.trim().toUpperCase(),
          bankName: bankName.trim(),
          branchName: bankBranch.trim(),
          verificationStatus: "pending",
        },
        servicePreferences: {
          primaryArea,
          preferredLocalities: selectedLocalities,
          preferredWorkingHours,
          workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          currentAvailability: "offline",
        },
        helperPreferences: {
          providesHelpers,
          helperCount,
          helperRatePaise: parseInt(helperRateRs || "250", 10) * 100,
          notes: helperNotes,
        },
        declarationAccepted,
        termsAccepted,
      };

      const updated = await driverOnboardingService.saveDraftProgress(uid, partial);
      setAppData(updated);
    } catch (e) {
      console.warn("Autosave draft error:", e);
    }
  };

  // Step 1: Send OTP simulation
  const handleSendOtp = () => {
    if (!phoneNumber || phoneNumber.trim().length !== 10) {
      Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    setOtpSent(true);
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    Alert.alert("OTP Sent", `Verification code sent to +91 ${phoneNumber}. (Use test code: 123456)`);
  };

  const handleVerifyOtp = () => {
    if (otpCode === "123456" || otpCode.length === 6) {
      setPhoneVerified(true);
      Alert.alert("Phone Verified", "Your mobile number has been authenticated successfully.");
    } else {
      Alert.alert("Invalid OTP", "Please enter the 6-digit verification code.");
    }
  };

  // Next Step Action with step-by-step validations
  const handleNext = async () => {
    // Validation for Step 1
    if (currentStep === 1) {
      if (!phoneVerified) {
        Alert.alert("Verification Required", "Please verify your mobile number with OTP to continue.");
        return;
      }
    }

    // Validation for Step 2
    if (currentStep === 2) {
      if (!fullName.trim()) {
        Alert.alert("Name Required", "Please enter your full legal name as per your government ID.");
        return;
      }
      if (!pinCode.trim() || pinCode.trim().length !== 6) {
        Alert.alert("Invalid PIN Code", "Please enter a valid 6-digit Coimbatore PIN code.");
        return;
      }
      if (!emergencyPhone.trim() || emergencyPhone.trim().length !== 10) {
        Alert.alert("Emergency Contact Required", "Please provide a valid 10-digit emergency contact number.");
        return;
      }
    }

    // Validation for Step 3
    if (currentStep === 3) {
      if (!profilePhotoUri) {
        Alert.alert("Photo Required", "Please capture or upload a clear passport-style driver photograph.");
        return;
      }
    }

    // Validation for Step 4
    if (currentStep === 4) {
      if (!identityFrontUri) {
        Alert.alert("Document Image Required", "Please upload the front image of your chosen identity document.");
        return;
      }
    }

    // Validation for Step 5
    if (currentStep === 5) {
      if (!licenceNumber.trim()) {
        Alert.alert("Licence Number Required", "Please enter your driving licence number.");
        return;
      }
      if (!licenceFrontUri) {
        Alert.alert("Licence Image Required", "Please upload the front image of your commercial driving licence.");
        return;
      }
      if (new Date(licenceExpiryDate) < new Date()) {
        Alert.alert("Licence Expired", "The licence expiry date entered is in the past. Expired licences cannot be accepted.");
        return;
      }
    }

    // Validation for Step 7
    if (currentStep === 7) {
      if (!vehicleRegNumber.trim() || vehicleRegNumber.trim().length < 6) {
        Alert.alert("Registration Required", "Please enter a valid vehicle registration number (e.g., TN 38 AB 1234).");
        return;
      }
    }

    // Validation for Step 8
    if (currentStep === 8) {
      if (!rcFrontUri) {
        Alert.alert("RC Required", "Please upload your vehicle Registration Certificate (RC).");
        return;
      }
      if (!insuranceUri) {
        Alert.alert("Insurance Required", "Please upload your valid commercial vehicle insurance certificate.");
        return;
      }
      if (ownershipType !== "self" && !ownerAuthUri) {
        Alert.alert("Owner Authorisation Required", "Since you are not the registered owner, an owner consent/lease document is required.");
        return;
      }
    }

    // Validation for Step 9
    if (currentStep === 9) {
      if (!bankAccountNumber.trim() || bankAccountNumber !== bankConfirmAccountNumber) {
        Alert.alert("Account Mismatch", "Bank account number and confirmation account number must match.");
        return;
      }
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(bankIfsc.trim().toUpperCase())) {
        Alert.alert("Invalid IFSC", "Please enter a valid 11-character Indian Financial System Code (e.g. SBIN0001234).");
        return;
      }
    }

    // Validation for Step 10
    if (currentStep === 10) {
      if (selectedLocalities.length === 0) {
        Alert.alert("Select Areas", "Please select at least one Coimbatore locality for trip requests.");
        return;
      }
    }

    const nextStep = currentStep + 1;
    await persistCurrentProgress(nextStep);
    setCurrentStep(nextStep);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  // Step 12: Final Application Submission
  const handleSubmitFinal = async () => {
    if (!declarationAccepted) {
      Alert.alert("Declaration Required", "Please check the box confirming that all details provided are accurate.");
      return;
    }
    if (!termsAccepted) {
      Alert.alert("Terms Required", "Please accept CARRY's Driver Partner Terms & Code of Conduct.");
      return;
    }

    try {
      setSubmitting(true);
      await persistCurrentProgress(12);
      const submitted = await driverOnboardingService.submitApplication(uid);
      Alert.alert(
        "Application Submitted!",
        `Your CARRY Driver Partner application has been received under Reference ID: ${submitted.referenceNumber}.\n\nOur Coimbatore verification team will review your documents.`,
        [
          {
            text: "View Status Hub",
            onPress: () => router.replace("/(driver)/registration/status"),
          },
        ]
      );
    } catch (e: any) {
      Alert.alert("Submission Error", e?.message || "Failed to submit application. Please check all fields.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.centerText}>Loading CARRY Partner Onboarding...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* Top Progress Tracker */}
        <OnboardingProgressBar
          currentStep={currentStep}
          totalSteps={12}
          stepTitle={STEP_TITLES[currentStep - 1]}
          onBack={handleBack}
          canGoBack={true}
        />

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* ========================================================
              STEP 1: MOBILE NUMBER & OTP
             ======================================================== */}
          {currentStep === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.heading}>Verify Your Mobile Number</Text>
              <Text style={styles.subtext}>
                We use your phone number for secure authentication, booking alerts, and customer coordination in Coimbatore.
              </Text>

              <View style={styles.phoneInputRow}>
                <View style={styles.countryCodeBox}>
                  <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                </View>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="10-digit mobile number"
                  keyboardType="number-pad"
                  maxLength={10}
                  value={phoneNumber}
                  onChangeText={(val) => {
                    setPhoneNumber(val);
                    if (phoneVerified) setPhoneVerified(false);
                  }}
                  editable={!phoneVerified}
                />
              </View>

              {!phoneVerified ? (
                <View style={{ marginTop: 12 }}>
                  <Button
                    title={otpSent ? "Resend OTP" : "Send Verification OTP"}
                    variant={otpSent ? "outline" : "primary"}
                    onPress={handleSendOtp}
                    disabled={resendCooldown > 0}
                  />
                  {resendCooldown > 0 && (
                    <Text style={styles.cooldownText}>Resend available in {resendCooldown}s</Text>
                  )}

                  {otpSent && (
                    <View style={styles.otpCard}>
                      <Text style={styles.otpLabel}>Enter 6-Digit OTP</Text>
                      <TextInput
                        style={styles.otpInput}
                        placeholder="••••••"
                        keyboardType="number-pad"
                        maxLength={6}
                        value={otpCode}
                        onChangeText={setOtpCode}
                      />
                      <Button
                        title="Verify OTP"
                        size="medium"
                        onPress={handleVerifyOtp}
                        style={{ marginTop: 10 }}
                      />
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedBadgeText}>✅ +91 {phoneNumber} Verified</Text>
                </View>
              )}
            </View>
          )}

          {/* ========================================================
              STEP 2: PERSONAL INFORMATION
             ======================================================== */}
          {currentStep === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.heading}>Personal Details</Text>
              <Text style={styles.subtext}>
                Enter your legal name and residential address in the Coimbatore district.
              </Text>

              <Input
                label="Full Legal Name (as per Govt ID) *"
                placeholder="e.g. Senthil Kumar R"
                value={fullName}
                onChangeText={setFullName}
              />

              <Input
                label="Date of Birth (YYYY-MM-DD) *"
                placeholder="1992-05-15"
                value={dob}
                onChangeText={setDob}
              />

              <Text style={styles.fieldLabel}>Gender (Optional)</Text>
              <View style={styles.choiceRow}>
                {(["male", "female", "other"] as const).map((g) => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => setGender(g)}
                    style={[styles.choiceChip, gender === g && styles.choiceChipSelected]}
                  >
                    <Text style={[styles.choiceText, gender === g && styles.choiceTextSelected]}>
                      {g.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Input
                label="Alternate Contact Number"
                placeholder="Optional secondary mobile"
                keyboardType="number-pad"
                maxLength={10}
                value={alternatePhone}
                onChangeText={setAlternatePhone}
              />

              <Input
                label="Email Address"
                placeholder="driver@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.sectionDivider}>Coimbatore Address</Text>
              <Input label="Door / House / Flat No. *" placeholder="e.g. 14/B" value={houseNo} onChangeText={setHouseNo} />
              <Input label="Street / Road *" placeholder="e.g. 5th Cross Street" value={street} onChangeText={setStreet} />
              <Input label="Area / Locality *" placeholder="e.g. Peelamedu" value={area} onChangeText={setArea} />
              <Input label="City" value={city} editable={false} />
              <Input label="State" value={state} editable={false} />
              <Input label="PIN Code (6 digits) *" placeholder="641004" keyboardType="number-pad" maxLength={6} value={pinCode} onChangeText={setPinCode} />

              <Text style={styles.sectionDivider}>Emergency Contact</Text>
              <Input label="Emergency Contact Name *" placeholder="Family member or friend" value={emergencyName} onChangeText={setEmergencyName} />
              <Input label="Emergency Contact Phone *" placeholder="10-digit mobile" keyboardType="number-pad" maxLength={10} value={emergencyPhone} onChangeText={setEmergencyPhone} />
              <Input label="Relationship *" placeholder="e.g. Brother, Spouse, Parent" value={emergencyRelation} onChangeText={setEmergencyRelation} />
            </View>
          )}

          {/* ========================================================
              STEP 3: PROFILE PHOTOGRAPH
             ======================================================== */}
          {currentStep === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.heading}>Driver Profile Photo</Text>
              <Text style={styles.subtext}>
                Take a clear, front-facing photograph against a plain background. This photo is displayed to customers for security when your vehicle is dispatched.
              </Text>

              <DocumentUploader
                title="Driver Headshot Photograph"
                subtitle="Ensure your face is clearly visible without sunglasses or cap."
                imageUri={profilePhotoUri}
                onImageSelected={setProfilePhotoUri}
                required
                statusBadge={profilePhotoUri ? "Photo Added" : "Action Required"}
              />

              <View style={styles.tipBox}>
                <Text style={styles.tipTitle}>💡 Photo Guidelines:</Text>
                <Text style={styles.tipItem}>• Good natural lighting</Text>
                <Text style={styles.tipItem}>• Neutral face expression</Text>
                <Text style={styles.tipItem}>• Clear view of eyes and face</Text>
              </View>
            </View>
          )}

          {/* ========================================================
              STEP 4: IDENTITY VERIFICATION
             ======================================================== */}
          {currentStep === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.heading}>Government Identity Verification</Text>
              <Text style={styles.subtext}>
                We adhere to strict Indian transport regulations. Never share Aadhaar OTP or biometric data.
              </Text>

              <Text style={styles.fieldLabel}>Select Identity Document *</Text>
              <View style={styles.choiceRow}>
                {(["aadhaar", "voter_id", "passport"] as IdentityDocType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setIdentityType(type)}
                    style={[styles.choiceChip, identityType === type && styles.choiceChipSelected]}
                  >
                    <Text style={[styles.choiceText, identityType === type && styles.choiceTextSelected]}>
                      {type.replace("_", " ").toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Input
                label="Full Name on Document *"
                placeholder="As printed on document"
                value={nameOnDoc}
                onChangeText={setNameOnDoc}
              />

              <Input
                label="Last 4 Digits of Document Number *"
                placeholder="e.g. 8941 (Stored masked for security)"
                keyboardType="number-pad"
                maxLength={4}
                value={docNumber}
                onChangeText={setDocNumber}
              />

              <DocumentUploader
                title="Document Front Side"
                subtitle="Clear photo of the front page with your name and photo."
                imageUri={identityFrontUri}
                onImageSelected={setIdentityFrontUri}
                required
              />

              <DocumentUploader
                title="Document Back Side (Optional)"
                subtitle="Address page of the document."
                imageUri={identityBackUri}
                onImageSelected={setIdentityBackUri}
                required={false}
              />

              <View style={styles.securityBanner}>
                <Text style={styles.securityText}>
                  🛡️ CARRY Security Protocol: Document photos are stored in encrypted private cloud storage and used solely for KYC verification.
                </Text>
              </View>
            </View>
          )}

          {/* ========================================================
              STEP 5: DRIVING LICENCE DETAILS
             ======================================================== */}
          {currentStep === 5 && (
            <View style={styles.stepContainer}>
              <Text style={styles.heading}>Commercial Driving Licence</Text>
              <Text style={styles.subtext}>
                Upload a valid commercial or transport driving licence issued by the Tamil Nadu Transport Department.
              </Text>

              <Input
                label="Driving Licence Number *"
                placeholder="e.g. TN38 20180004123"
                value={licenceNumber}
                onChangeText={setLicenceNumber}
                autoCapitalize="characters"
              />

              <Input
                label="Name on Licence *"
                placeholder="Full name as printed"
                value={nameOnLicence}
                onChangeText={setNameOnLicence}
              />

              <Input
                label="Licence Expiry Date (YYYY-MM-DD) *"
                placeholder="2035-12-31"
                value={licenceExpiryDate}
                onChangeText={setLicenceExpiryDate}
              />

              <Input
                label="Issuing RTO Authority *"
                placeholder="e.g. TN-38 Coimbatore South"
                value={issuingRTO}
                onChangeText={setIssuingRTO}
              />

              <Input
                label="Licence Class / Badge *"
                placeholder="e.g. LMV-TR, TRANS"
                value={licenceClass}
                onChangeText={setLicenceClass}
              />

              <DocumentUploader
                title="Licence Front Side *"
                subtitle="Photo showing your licence badge, photograph, and validity."
                imageUri={licenceFrontUri}
                onImageSelected={setLicenceFrontUri}
                required
                isExpired={new Date(licenceExpiryDate) < new Date()}
              />

              <DocumentUploader
                title="Licence Back Side *"
                subtitle="Photo showing endorsement and vehicle category permissions."
                imageUri={licenceBackUri}
                onImageSelected={setLicenceBackUri}
                required
              />
            </View>
          )}

          {/* ========================================================
              STEP 6: VEHICLE CATEGORY SELECTION
             ======================================================== */}
          {currentStep === 6 && (
            <View style={styles.stepContainer}>
              <Text style={styles.heading}>Select Vehicle Category</Text>
              <Text style={styles.subtext}>
                Choose the primary commercial vehicle category you will drive in Coimbatore. You can register additional vehicles later.
              </Text>

              <View style={styles.categoryList}>
                {COIMBATORE_VEHICLE_ONBOARDING_CATEGORIES.map((cat) => {
                  const isSelected = selectedVehicleCategory === cat.key;
                  return (
                    <TouchableOpacity
                      key={cat.key}
                      activeOpacity={0.85}
                      onPress={() => setSelectedVehicleCategory(cat.key)}
                      style={[styles.categoryCard, isSelected && styles.categoryCardSelected]}
                    >
                      <View style={styles.categoryCardHeader}>
                        <Text style={styles.categoryName}>{cat.displayName}</Text>
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryBadgeText}>{cat.badge}</Text>
                        </View>
                      </View>
                      <Text style={styles.categoryTagline}>{cat.tagline}</Text>

                      <View style={styles.specsRow}>
                        <Text style={styles.specText}>📏 {cat.dimensionsFeet.length}' × {cat.dimensionsFeet.width}' × {cat.dimensionsFeet.height}'</Text>
                        <Text style={styles.specText}>⚖️ Max: {cat.maxPayloadKg} kg</Text>
                        <Text style={styles.specText}>🛞 Models: {cat.sampleModels}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* ========================================================
              STEP 7: VEHICLE INFORMATION
             ======================================================== */}
          {currentStep === 7 && (
            <View style={styles.stepContainer}>
              <Text style={styles.heading}>Vehicle Specifications</Text>
              <Text style={styles.subtext}>
                Enter the details of your commercial vehicle registered in Tamil Nadu.
              </Text>

              <Input
                label="Vehicle Registration Number *"
                placeholder="e.g. TN 38 AB 1234"
                value={vehicleRegNumber}
                onChangeText={setVehicleRegNumber}
                autoCapitalize="characters"
              />

              <Input
                label="Vehicle Manufacturer / Make *"
                placeholder="e.g. Tata, Mahindra, Piaggio"
                value={vehicleMake}
                onChangeText={setVehicleMake}
              />

              <Input
                label="Vehicle Model *"
                placeholder="e.g. Ace Gold BS6"
                value={vehicleModel}
                onChangeText={setVehicleModel}
              />

              <Input
                label="Manufacturing Year *"
                placeholder="e.g. 2022"
                keyboardType="number-pad"
                maxLength={4}
                value={vehicleYear}
                onChangeText={setVehicleYear}
              />

              <Input
                label="Vehicle Color *"
                placeholder="e.g. White"
                value={vehicleColor}
                onChangeText={setVehicleColor}
              />

              <Text style={styles.fieldLabel}>Fuel Type</Text>
              <View style={styles.choiceRow}>
                {(["diesel", "cng", "electric", "petrol"] as const).map((fuel) => (
                  <TouchableOpacity
                    key={fuel}
                    onPress={() => setVehicleFuel(fuel)}
                    style={[styles.choiceChip, vehicleFuel === fuel && styles.choiceChipSelected]}
                  >
                    <Text style={[styles.choiceText, vehicleFuel === fuel && styles.choiceTextSelected]}>
                      {fuel.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.fieldLabel}>Vehicle Body Type</Text>
              <View style={styles.choiceRow}>
                {(["open_top", "closed_container", "tarpaulin"] as const).map((body) => (
                  <TouchableOpacity
                    key={body}
                    onPress={() => setVehicleBody(body)}
                    style={[styles.choiceChip, vehicleBody === body && styles.choiceChipSelected]}
                  >
                    <Text style={[styles.choiceText, vehicleBody === body && styles.choiceTextSelected]}>
                      {body.replace("_", " ").toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionDivider}>Ownership Arrangement</Text>
              <Text style={styles.fieldLabel}>Ownership Type *</Text>
              <View style={styles.choiceRow}>
                {(["self", "family", "rented", "leased", "authorised"] as VehicleOwnershipType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setOwnershipType(type)}
                    style={[styles.choiceChip, ownershipType === type && styles.choiceChipSelected]}
                  >
                    <Text style={[styles.choiceText, ownershipType === type && styles.choiceTextSelected]}>
                      {type.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Input
                label="Registered Owner Name (as on RC) *"
                placeholder="Owner full name"
                value={registeredOwner}
                onChangeText={setRegisteredOwner}
              />
            </View>
          )}

          {/* ========================================================
              STEP 8: VEHICLE DOCUMENTS
             ======================================================== */}
          {currentStep === 8 && (
            <View style={styles.stepContainer}>
              <Text style={styles.heading}>Vehicle Document Uploads</Text>
              <Text style={styles.subtext}>
                Upload clear photographs of your vehicle's RC, commercial insurance, and fitness certificates.
              </Text>

              <DocumentUploader
                title="Registration Certificate (RC) *"
                subtitle="RC Book or Smart Card showing registration number & owner."
                imageUri={rcFrontUri}
                onImageSelected={setRcFrontUri}
                required
              />

              <Input
                label="Insurance Expiry Date (YYYY-MM-DD) *"
                placeholder="2027-04-30"
                value={insuranceExpiry}
                onChangeText={setInsuranceExpiry}
              />

              <DocumentUploader
                title="Commercial Insurance Policy *"
                subtitle="Valid third-party or comprehensive goods vehicle insurance policy."
                imageUri={insuranceUri}
                onImageSelected={setInsuranceUri}
                required
                isExpired={new Date(insuranceExpiry) < new Date()}
              />

              <DocumentUploader
                title="Fitness Certificate (Optional for Newer Vehicles)"
                subtitle="Form 38 certificate from Coimbatore RTO."
                imageUri={fitnessUri}
                onImageSelected={setFitnessUri}
                required={false}
              />

              <DocumentUploader
                title="Goods Carriage Permit (Optional)"
                subtitle="State or National goods permit document."
                imageUri={permitUri}
                onImageSelected={setPermitUri}
                required={false}
              />

              {ownershipType !== "self" && (
                <DocumentUploader
                  title="Owner Consent / Authorisation Letter *"
                  subtitle="Required because the vehicle is owned by a third party or leased."
                  imageUri={ownerAuthUri}
                  onImageSelected={setOwnerAuthUri}
                  required
                />
              )}
            </View>
          )}

          {/* ========================================================
              STEP 9: BANK DETAILS
             ======================================================== */}
          {currentStep === 9 && (
            <View style={styles.stepContainer}>
              <Text style={styles.heading}>Bank & Payout Account</Text>
              <Text style={styles.subtext}>
                Your trip earnings and helper fees are directly deposited into this bank account.
              </Text>

              <Input
                label="Account Holder Name (as per Bank Passbook) *"
                placeholder="e.g. Senthil Kumar R"
                value={bankHolderName}
                onChangeText={setBankHolderName}
              />

              <Input
                label="Bank Account Number *"
                placeholder="Enter complete account number"
                keyboardType="number-pad"
                secureTextEntry
                value={bankAccountNumber}
                onChangeText={setBankAccountNumber}
              />

              <Input
                label="Confirm Bank Account Number *"
                placeholder="Re-enter bank account number"
                keyboardType="number-pad"
                value={bankConfirmAccountNumber}
                onChangeText={setBankConfirmAccountNumber}
              />

              <Input
                label="Bank IFSC Code (11 characters) *"
                placeholder="e.g. SBIN0001234"
                autoCapitalize="characters"
                maxLength={11}
                value={bankIfsc}
                onChangeText={setBankIfsc}
              />

              <Input
                label="Bank Name *"
                placeholder="e.g. State Bank of India, Indian Overseas Bank"
                value={bankName}
                onChangeText={setBankName}
              />

              <Input
                label="Branch Name"
                placeholder="e.g. Gandhipuram Branch, Coimbatore"
                value={bankBranch}
                onChangeText={setBankBranch}
              />

              <View style={styles.tipBox}>
                <Text style={styles.tipTitle}>🔒 Payout Security:</Text>
                <Text style={styles.tipItem}>• Account numbers are masked across the platform.</Text>
                <Text style={styles.tipItem}>• Customers never see your banking details.</Text>
                <Text style={styles.tipItem}>• Bank verification is reviewed separately by the accounts team.</Text>
              </View>
            </View>
          )}

          {/* ========================================================
              STEP 10: SERVICE PREFERENCES
             ======================================================== */}
          {currentStep === 10 && (
            <View style={styles.stepContainer}>
              <Text style={styles.heading}>Service Area & Working Preferences</Text>
              <Text style={styles.subtext}>
                Configure your preferred base location and operating zones across Coimbatore.
              </Text>

              <Input
                label="Primary Base Locality *"
                placeholder="e.g. Gandhipuram (Central Hub)"
                value={primaryArea}
                onChangeText={setPrimaryArea}
              />

              <CoimbatoreAreaPicker
                selectedLocalities={selectedLocalities}
                onToggleLocality={(loc) => {
                  if (selectedLocalities.includes(loc)) {
                    setSelectedLocalities(selectedLocalities.filter((item) => item !== loc));
                  } else {
                    setSelectedLocalities([...selectedLocalities, loc]);
                  }
                }}
                onSelectAll={() => setSelectedLocalities(COIMBATORE_LOCALITIES)}
              />

              <Text style={styles.fieldLabel}>Preferred Working Hours</Text>
              <View style={styles.choiceRow}>
                {(["full_day", "morning", "evening", "flexible"] as const).map((pref) => (
                  <TouchableOpacity
                    key={pref}
                    onPress={() => setPreferredWorkingHours(pref)}
                    style={[styles.choiceChip, preferredWorkingHours === pref && styles.choiceChipSelected]}
                  >
                    <Text style={[styles.choiceText, preferredWorkingHours === pref && styles.choiceTextSelected]}>
                      {pref.replace("_", " ").toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* ========================================================
              STEP 11: HELPER PREFERENCES
             ======================================================== */}
          {currentStep === 11 && (
            <View style={styles.stepContainer}>
              <Text style={styles.heading}>Loading & Unloading Helpers</Text>
              <Text style={styles.subtext}>
                CARRY customers can book goods vehicles with or without helpers for lifting and shifting cargo.
              </Text>

              <Text style={styles.fieldLabel}>Do you provide loading/unloading helpers? *</Text>
              <View style={styles.choiceRow}>
                {[
                  { key: "yes", label: "Yes, I provide helpers" },
                  { key: "no", label: "No, vehicle only" },
                  { key: "conditional", label: "Depends on booking" },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    onPress={() => setProvidesHelpers(item.key as any)}
                    style={[styles.choiceChip, providesHelpers === item.key && styles.choiceChipSelected]}
                  >
                    <Text style={[styles.choiceText, providesHelpers === item.key && styles.choiceTextSelected]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {providesHelpers !== "no" && (
                <View style={{ marginTop: 12 }}>
                  <Text style={styles.fieldLabel}>Number of Helpers Available</Text>
                  <View style={styles.choiceRow}>
                    {[1, 2].map((num) => (
                      <TouchableOpacity
                        key={num}
                        onPress={() => setHelperCount(num)}
                        style={[styles.choiceChip, helperCount === num && styles.choiceChipSelected]}
                      >
                        <Text style={[styles.choiceText, helperCount === num && styles.choiceTextSelected]}>
                          {num} {num === 1 ? "Helper" : "Helpers"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Input
                    label="Helper Rate (₹ per trip) *"
                    placeholder="250"
                    keyboardType="number-pad"
                    value={helperRateRs}
                    onChangeText={setHelperRateRs}
                  />

                  <Input
                    label="Helper Availability / Special Notes"
                    placeholder="e.g. Ground floor to 2nd floor with lift only"
                    value={helperNotes}
                    onChangeText={setHelperNotes}
                  />
                </View>
              )}
            </View>
          )}

          {/* ========================================================
              STEP 12: REVIEW APPLICATION & DECLARATION
             ======================================================== */}
          {currentStep === 12 && (
            <View style={styles.stepContainer}>
              <Text style={styles.heading}>Review Your Application</Text>
              <Text style={styles.subtext}>
                Please verify all 11 sections before submitting for verification by the CARRY Coimbatore team.
              </Text>

              {/* Section 1: Personal */}
              <View style={styles.reviewSection}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewTitle}>👤 Personal Information</Text>
                  <TouchableOpacity onPress={() => setCurrentStep(2)}>
                    <Text style={styles.editBtn}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.reviewText}>• Name: {fullName || "Incomplete"}</Text>
                <Text style={styles.reviewText}>• Phone: +91 {phoneNumber} (Verified)</Text>
                <Text style={styles.reviewText}>• Address: {houseNo}, {street}, {area}, Coimbatore - {pinCode}</Text>
                <Text style={styles.reviewText}>• Emergency: {emergencyName} ({emergencyPhone} · {emergencyRelation})</Text>
              </View>

              {/* Section 2: Photo */}
              <View style={styles.reviewSection}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewTitle}>📸 Profile Photograph</Text>
                  <TouchableOpacity onPress={() => setCurrentStep(3)}>
                    <Text style={styles.editBtn}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.reviewText}>
                  • Status: {profilePhotoUri ? "✅ Headshot Attached" : "❌ Missing Photograph"}
                </Text>
              </View>

              {/* Section 3: Identity */}
              <View style={styles.reviewSection}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewTitle}>🪪 Identity Verification</Text>
                  <TouchableOpacity onPress={() => setCurrentStep(4)}>
                    <Text style={styles.editBtn}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.reviewText}>• Type: {identityType.toUpperCase()}</Text>
                <Text style={styles.reviewText}>• Number: XXXX-XXXX-{docNumber.slice(-4) || "0000"}</Text>
                <Text style={styles.reviewText}>• Document Image: {identityFrontUri ? "✅ Front Uploaded" : "❌ Missing"}</Text>
              </View>

              {/* Section 4: Licence */}
              <View style={styles.reviewSection}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewTitle}>📄 Driving Licence</Text>
                  <TouchableOpacity onPress={() => setCurrentStep(5)}>
                    <Text style={styles.editBtn}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.reviewText}>• Licence No: {licenceNumber || "Incomplete"}</Text>
                <Text style={styles.reviewText}>• Class: {licenceClass}</Text>
                <Text style={styles.reviewText}>• Expiry: {licenceExpiryDate}</Text>
              </View>

              {/* Section 5: Vehicle */}
              <View style={styles.reviewSection}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewTitle}>🚚 Vehicle Details</Text>
                  <TouchableOpacity onPress={() => setCurrentStep(7)}>
                    <Text style={styles.editBtn}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.reviewText}>• Category: {selectedVehicleCategory.replace("_", " ").toUpperCase()}</Text>
                <Text style={styles.reviewText}>• Registration: {vehicleRegNumber || "Incomplete"}</Text>
                <Text style={styles.reviewText}>• Model: {vehicleMake} {vehicleModel} ({vehicleYear})</Text>
                <Text style={styles.reviewText}>• Ownership: {ownershipType.toUpperCase()} (Owner: {registeredOwner || fullName})</Text>
              </View>

              {/* Section 6: Bank */}
              <View style={styles.reviewSection}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewTitle}>🏦 Bank & Payout Details</Text>
                  <TouchableOpacity onPress={() => setCurrentStep(9)}>
                    <Text style={styles.editBtn}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.reviewText}>• Holder: {bankHolderName || fullName}</Text>
                <Text style={styles.reviewText}>• Account: XXXXXX{bankAccountNumber.slice(-4) || "0000"}</Text>
                <Text style={styles.reviewText}>• IFSC: {bankIfsc || "Incomplete"}</Text>
              </View>

              {/* Section 7: Helpers */}
              <View style={styles.reviewSection}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewTitle}>🤝 Helper Preferences</Text>
                  <TouchableOpacity onPress={() => setCurrentStep(11)}>
                    <Text style={styles.editBtn}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.reviewText}>• Provides Helpers: {providesHelpers.toUpperCase()}</Text>
                {providesHelpers !== "no" && (
                  <Text style={styles.reviewText}>• Helpers: {helperCount} (₹{helperRateRs} per trip)</Text>
                )}
              </View>

              {/* Declarations */}
              <View style={styles.declarationBox}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  activeOpacity={0.8}
                  onPress={() => setDeclarationAccepted(!declarationAccepted)}
                >
                  <View style={[styles.checkbox, declarationAccepted && styles.checkboxActive]}>
                    {declarationAccepted && <Text style={styles.checkIcon}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    I confirm that the information and documents provided are accurate and belong to me or are submitted with appropriate legal authorisation.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.checkboxRow, { marginTop: 12 }]}
                  activeOpacity={0.8}
                  onPress={() => setTermsAccepted(!termsAccepted)}
                >
                  <View style={[styles.checkbox, termsAccepted && styles.checkboxActive]}>
                    {termsAccepted && <Text style={styles.checkIcon}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    I accept CARRY's Driver Partner Terms of Service and Privacy Policy for Coimbatore logistics operations.
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Wizard Action Footer */}
          <View style={styles.footerActionRow}>
            {currentStep < 12 ? (
              <Button
                title={`Continue to Step ${currentStep + 1}`}
                size="large"
                onPress={handleNext}
                style={{ flex: 1 }}
              />
            ) : (
              <Button
                title="Submit Application for Verification"
                size="large"
                loading={submitting}
                onPress={handleSubmitFinal}
                style={{ flex: 1 }}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  centerText: {
    marginTop: 12,
    fontSize: 15,
    color: colors.secondaryText,
  },
  stepContainer: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.deepNavy,
    marginBottom: 6,
  },
  subtext: {
    fontSize: 14,
    color: colors.secondaryText,
    marginBottom: 20,
    lineHeight: 20,
  },
  phoneInputRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  countryCodeBox: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 14,
    borderRadius: 12,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.deepNavy,
    height: 52,
  },
  cooldownText: {
    fontSize: 12,
    color: colors.secondaryText,
    textAlign: "center",
    marginTop: 6,
  },
  otpCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
  },
  otpLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.deepNavy,
    marginBottom: 8,
  },
  otpInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 10,
    height: 50,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 8,
    color: colors.deepNavy,
  },
  verifiedBadge: {
    backgroundColor: "#DCFCE7",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#86EFAC",
    alignItems: "center",
    marginTop: 10,
  },
  verifiedBadgeText: {
    color: "#166534",
    fontSize: 15,
    fontWeight: "700",
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.deepNavy,
    marginBottom: 8,
    marginTop: 12,
  },
  choiceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  choiceChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  choiceChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  choiceText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.deepNavy,
  },
  choiceTextSelected: {
    color: "#FFFFFF",
  },
  sectionDivider: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.deepNavy,
    marginTop: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 4,
  },
  tipBox: {
    backgroundColor: "#F8FAFC",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 10,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.deepNavy,
    marginBottom: 4,
  },
  tipItem: {
    fontSize: 12,
    color: colors.secondaryText,
    lineHeight: 18,
  },
  securityBanner: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  securityText: {
    fontSize: 12,
    color: "#166534",
    lineHeight: 18,
  },
  categoryList: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  categoryCardSelected: {
    borderColor: colors.primary,
    backgroundColor: "#FAF9FF",
  },
  categoryCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.deepNavy,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: "#F0EDFF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
  },
  categoryTagline: {
    fontSize: 13,
    color: colors.secondaryText,
    marginBottom: 10,
  },
  specsRow: {
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 8,
    gap: 4,
  },
  specText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  reviewSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.deepNavy,
  },
  editBtn: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  reviewText: {
    fontSize: 13,
    color: colors.secondaryText,
    lineHeight: 19,
  },
  declarationBox: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 10,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkIcon: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.deepNavy,
    lineHeight: 18,
  },
  footerActionRow: {
    marginTop: 20,
    flexDirection: "row",
  },
});
