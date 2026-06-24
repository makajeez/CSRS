import { useState, type ReactNode, type FC, type JSX, type ChangeEvent } from "react";
import PinDropTwoTone from '@mui/icons-material/PinDropTwoTone';
import TheaterComedyTwoTone from '@mui/icons-material/TheaterComedyTwoTone';
import PsychologyAltTwoToneIcon from '@mui/icons-material/PsychologyAltTwoTone';
import SportsKabaddiTwoToneIcon from '@mui/icons-material/SportsKabaddiTwoTone';
import PowerOffTwoToneIcon from '@mui/icons-material/PowerOffTwoTone';
import PersonOffTwoToneIcon from '@mui/icons-material/PersonOffTwoTone';
import TipsAndUpdatesTwoToneIcon from '@mui/icons-material/TipsAndUpdatesTwoTone';
import ImageTwoToneIcon from '@mui/icons-material/ImageTwoTone';
import TimerTwoToneIcon from '@mui/icons-material/TimerTwoTone'

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';

import { getLgas, getStates } from "ng-states-core";
import { PulsingDot } from '../shared/SharedUI';
import { enqueueSnackbar } from "notistack";

const IconCheck = () => (
  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

interface LocData {
  coords: { lat: number; long: number; accuracy?: number };
  timestamp: number;
}
interface FormState {
  threatCategory: number;
  severityLevel: string;
  address: string;
  state: string;
  lga: string;
  lat?: number;
  long?: number;
  datetime: string;
  description: string;
  suspect: string;
  evidenceMedia: string | null ;
  anonymous: boolean;
  corroborate: boolean;
  update: boolean;
}

interface ToggleSetting {
  label: string;
  desc: string;
  val: boolean;
  toggle: () => void;
}

interface SevLevel {
  key: string;
  label: string;
  selClass: string;
}

const THREAT_TYPES = [
  { Icon: TheaterComedyTwoTone,       name: "Armed robbery",       sub: "WEAPONS · THEFT" },
  { Icon: PsychologyAltTwoToneIcon,   name: "Suspicious activity", sub: "SURVEILLANCE" },
  { Icon: SportsKabaddiTwoToneIcon,   name: "Civil unrest",        sub: "CROWD · PROTEST" },
  { Icon: PowerOffTwoToneIcon,        name: "Infrastructure",      sub: "ROAD · UTILITY" },
  { Icon: PersonOffTwoToneIcon,       name: "Missing person",      sub: "ABDUCTION · LOST" },
  { Icon: TipsAndUpdatesTwoToneIcon,  name: "Pre-emptive intel",   sub: "EARLY WARNING" },
];

const SEV_LEVELS: SevLevel[] = [
  { key: "low",  label: "Low",      selClass: "dark:bg-teal-500/10  dark:border-teal-500  dark:text-teal-400" },
  { key: "med",  label: "Medium",   selClass: "dark:bg-amber-400/10 dark:border-amber-400 dark:text-amber-400" },
  { key: "high", label: "High",     selClass: "dark:bg-red-500/10   dark:border-red-500   dark:text-red-400" },
  { key: "crit", label: "Critical", selClass: "dark:bg-red-500      dark:border-red-500   dark:text-white" },
];

const STEP_LABELS = ["01 CLASSIFY", "02 LOCATE", "03 DETAIL", "04 SUBMIT"];

const generateReportRef = () => {
  const year = new Date().getFullYear();
  return `CS-${year}-` + String(Math.floor(10000 + Math.random() * 9999999999));
};

const inputCls = "w-full border bg-white/5 border-white/50 dark:bg-[#1a1a18] dark:border-white/[0.08] rounded-lg px-3 py-[9px] text-[13px] dark:text-[#f5f4ef] outline-none focus:border-white/20 transition-colors";
  
const Toggle: FC<{ on: boolean; onToggle: () => void }> = ({ on, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative w-9 h-5 rounded-full shrink-0 transition-colors duration-200 border ${
      on ? "bg-black border-black dark:bg-red-500 dark:border-red-500" : "bg-white/10 border-white/20"
    }`}
  >
    <span
      className={`absolute top-0.75 left-0.75 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
        on ? "translate-x-4" : "translate-x-0"
      }`}
    />
  </button>
);

const Card: FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-[#838380]/90 hover:bg-black/60 dark:bg-[#111110] border border-white/8 rounded-xl p-5 mb-3 ${className}`}>
    {children}
  </div>
);

const CardLabel: FC<{ children: ReactNode; required?: boolean }> = ({ children, required }) => (
  <div className="flex items-center gap-2 font-mono text-[9px] tracking-widest uppercase dark:text-white/30 font-bold mb-4">
    {children}
    {required && (
      <span className="text-red-500 bg-red-500/10 dark:text-red-500 font-mono text-[9px] px-2 py-0.5 rounded-full">
        * REQUIRED
      </span>
    )}
  </div>
);

const Field: FC<{ label?: string; children: ReactNode; className?: string }> = ({ label, children, className = "" }) => (
  <div className={`mb-3 ${className}`}>
    {label && (
      <label className="block text-[12px] font-bold text-black/50 dark:text-white/55 mb-1.25 tracking-[-0.01em]">
        {label}
      </label>
    )}
    {children}
  </div>
);


const StepNav: FC<{
  step: number;
  total: number;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}> = ({ step, total, onBack, onNext, nextLabel }) => (
  <div className="flex gap-2 mt-4">
    {step > 0 && (
      <button
        onClick={onBack}
        className="px-5 py-2 rounded-lg border border-white/12 bg-[#1a1a18] text-white/55 text-[13px] font-bold hover:text-white/80 hover:border-white/25 transition-all cursor-pointer"
      >
         Back
      </button>
    )}
    <button
      onClick={onNext}
      className={`px-6 py-2 rounded-lg text-[13px] font-extrabold tracking-[-0.02em] border-none cursor-pointer transition-all ${
        step === total - 1
          ? "bg-red-500 hover:bg-red-600 active:scale-[0.98] text-white"
          : "bg-black/80 dark:bg-white/10 hover:bg-black dark:hover:bg-white/15 text-white"
      }`}
    >
      {nextLabel ?? (step === total - 1 ? "Submit report " : "Continue ")}
    </button>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────
export default function Report(): JSX.Element {
  const [activeStep, setActiveStep] = useState(0);
  const [threat, setThreat] = useState(0);
  const [sev, setSev] = useState("low");
  const [submitted, setSubmitted] = useState(false);
  const [refNo, setRefNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  

  const STATES = getStates().map((s) => s.state).sort();

  const getInitialFormState = (): FormState => ({
    threatCategory: 0,
    severityLevel: "low",
    address: "",
    state: STATES[0],
    lga: "",
    lat: 0,
    long: 0,
    datetime: "",
    description: "",
    suspect: "",
    evidenceMedia: null,
    anonymous: false,
    corroborate: false,
    update: false,
  });


  const [form, setForm] = useState<FormState>(getInitialFormState());

  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const resetForm = () => {
    setThreat(0);
    setSev("low");
    setForm(getInitialFormState());
    setMediaFile(null);
    setMediaPreview(null);
  };

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setMediaFile(file);
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setMediaPreview(objectUrl);
            setForm((prev) => ({ ...prev, evidenceMedia: objectUrl}))
        } else {
            setMediaPreview(null);
            setForm((prev) => ({ ...prev, evidenceMedia: null}))
        }
  };

  const LGAS = getLgas(`${form.state}`).sort();

  const setField = (key: keyof FormState, value?: string) => 
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value || value }));

  const   setDateTime = (timestamp: number | Date) => {
    const datestr = new Date(timestamp).toISOString().split("T");
    const date = datestr[0];
    const time = datestr[1].split(":");
    const dateTime = [date, [parseInt(time[0]) + 1, time[1]].join(":")].join("T");
    setForm((prev) => ({ ...prev, datetime: dateTime }));
  };

  const setAddress = async (coords: { lat: number; long: number }) => {
    const { lat, long } = coords;
    const GMapApiKey = import.meta.env.VITE_GMAP_API_URL;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${GMapApiKey}`
      );

      if (!response.ok) {
        enqueueSnackbar(`Geocode request failed: ${response.status} ${response.statusText}, enter manually`, { variant: 'error' });
      }

      const json = await response.json();
      const components = json.results?.[0]?.address_components;

      if (!Array.isArray(components)) {
        enqueueSnackbar('Geocode response did not include address components, enter manually', { variant: 'error'});
      }

      const addressData: { state?: string; lga?: string; address?: string } = {};

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      components.forEach((c: any) => {
        if (c.types.includes('administrative_area_level_1')) {
          addressData.state = c.long_name;
        }
        if (c.types.includes('administrative_area_level_2')) {
          addressData.lga = c.long_name;
        }
        if (c.types.includes('administrative_area_level_3')) {
          addressData.address = c.long_name;
        }
      });

      if (!addressData.state || !addressData.lga || !addressData.address) {
        enqueueSnackbar('Incomplete address data from geocode response, enter manually', {variant: 'error'});
      }

      setForm((prev) => ({
        ...prev,
        lat: lat,
        long: long,
        state: addressData.state!,
        lga: addressData.lga!,
        address: addressData.address!,
      }));
    } catch (error) {
      console.error('Error setting address from coordinates:', error);
    }
  };

  const invokeGPS = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locData: LocData = {
          coords: { lat: position.coords.latitude, long: position.coords.longitude, accuracy: position.coords.accuracy },
          timestamp: position.timestamp,
        };
        setAddress(locData.coords);
        setLoading(false);
        enqueueSnackbar(`Location data fetched`, { variant: "success" });
      },
      () => {
        enqueueSnackbar(`Error fetching data, enter manually`, { variant: "error" });
        setLoading(false);
      }
    );
  };

  const handleNext = () => {
    if (activeStep < STEP_LABELS.length - 1) setActiveStep((s) => s + 1);
    else handleSubmit();
  };

  const handleBack = () => setActiveStep((s) => s - 1);

  function handleSubmit() {
    setRefNo(generateReportRef());
    setSubmitted(true);
    resetForm();
  }

  const toggleSettings: ToggleSetting[] = [
    {
      label: "Anonymous report",
      desc: "Your identity will never be shared with authorities or other users",
      val: form.anonymous,
      toggle: () => {
        // setAnon((v: boolean) => !v);
        setForm((prev) => ({ ...prev, anonymous: !prev.anonymous }));
      },
    },
    {
      label: "Allow community corroboration",
      desc: "Nearby users can verify and add details to this report",
      val: form.corroborate,
      toggle: () => {
        // setCorr((v: boolean) => !v);
        setForm((prev) => ({ ...prev, corroborate: !prev.corroborate }));
      },
    },
    {
      label: "Receive status updates",
      desc: "Get notified when authorities respond or status changes",
      val: form.update,
      toggle: () => {
        setUpdate((v: boolean) => !v);
        setForm((prev) => ({ ...prev, update: !prev.update }));
      },
    },
  ];

  const stepContent = [
    // 01 CLASSIFY
    <>
      <Card>
        <CardLabel required>Threat category</CardLabel>
        <div className="grid grid-cols-3 gap-2">
          {THREAT_TYPES.map(({ Icon, name, sub }, i) => (
            <button
              key={name}
              onClick={() => {
                setThreat(i);
                setForm((prev) => ({ ...prev, threatCategory: i }));
              }}
              className={`flex flex-col items-center gap-[5px] py-3 px-2 rounded-lg border transition-all duration-150 cursor-pointer text-center ${
                threat === i
                  ? "border-black/90 bg-black/35 dark:border-red-500 dark:bg-red-500/6"
                  : "border-black/5 bg-black/20 dark:border-white/8 dark:bg-[#1a1a18] dark:hover:border-white/20"
              }`}
            >
              <div className={`w-7 h-7 flex rounded-lg items-center justify-center text-[13px] bg-white/10 text-black/90 dark:text-red-500 dark:bg-red-500/10`}>
                <Icon />
              </div>
              <span className={`text-[11px] font-bold leading-tight ${threat === i ? "dark:text-red-500 text-white/80" : "dark:text-[#f5f4ef]"}`}>
                {name}
              </span>
              <span className="font-mono text-[8px] dark:text-white/30">{sub}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardLabel required>Severity level</CardLabel>
        <div className="flex gap-2">
          {SEV_LEVELS.map(({ key, label, selClass }) => (
            <button
              key={key}
              onClick={() => {
                setSev(key);
                setForm((prev) => ({ ...prev, severityLevel: key }));
              }}
              className={`flex-1 py-[9px] rounded-lg border text-[11px] font-bold transition-all duration-150 cursor-pointer ${
                sev === key ? selClass : "bg-transparent text-black dark:text-white/45 dark:border-white/8 border-black/20 dark:hover:border-white/20"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>
    </>,

    // 02 LOCATE
    <Card>
      <CardLabel required>Incident location</CardLabel>
      <div className="flex gap-2 items-end mb-3">
        <Field label="Address or landmark" className="flex-1 mb-0!">
          <input className={inputCls} placeholder="Wuse Market, Abuja" value={form.address} onChange={setField("address")} />
        </Field>
        <button
          onClick={invokeGPS}
          className="flex items-center gap-[5px] px-4 py-[9px] rounded-lg border bg-white/5 border-white/50 dark:border-white/12 dark:bg-[#1a1a18] text-[11px] font-bold dark:text-white/55 dark:hover:text-white/80 dark:hover:border-white/25 transition-all cursor-pointer whitespace-nowrap h-10"
        >
         {!loading ? (
            <>
              <PinDropTwoTone />
              Use GPS
            </>
          ) : (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Locating...
            </span>
          )}
        </button>
      </div>
      <div className="flex gap-2 mb-3">
        <Field label="State" className="flex-1 mb-0!">
          <select className={inputCls} value={form.state} onChange={setField("state")}>
            {STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="LGA" className="flex-1 mb-0!">
          <select className={inputCls} value={form.lga} onChange={setField("lga")}>
            {LGAS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </Field>
      </div>
      <div className="flex gap-2 items-end mb-3">
        <Field label="Time of incident"  className="flex-1 mb-0!">
          <input type="datetime-local" className={inputCls} value={form.datetime} onChange={setField("datetime")} />
        </Field>
        <button
            onClick={() => {
              const now = new Date();
              setDateTime(now)
            }}
            className="flex items-center gap-[5px] px-4 py-[9px] rounded-lg border bg-white/5 border-white/50 dark:border-white/12 dark:bg-[#1a1a18] text-[11px] font-bold dark:text-white/55 dark:hover:text-white/80 dark:hover:border-white/25 transition-all cursor-pointer whitespace-nowrap h-10"
          >
          <TimerTwoToneIcon />
          Current Time
        </button>
      </div>
    </Card>,

    // 03 DETAIL
    <>
      <Card>
        <CardLabel required>Incident description</CardLabel>
        <Field label="What happened? Be as specific as possible">
          <textarea
            className={`${inputCls} min-h-[90px] resize-y leading-[1.6]`}
            placeholder="Describe what you saw — number of people involved, vehicles, weapons, direction of movement, any identifiable features..."
            value={form.description}
            onChange={setField("description")}
          />
        </Field>
        <Field label="Suspect description (optional)">
          <input className={inputCls} placeholder="e.g. Male, red shirt, Toyota Camry, plate no. ABC-123-XY" value={form.suspect} onChange={setField("suspect")} />
        </Field>
      </Card>

     <Card>
  <CardLabel>
    Evidence media
    <span className="font-mono text-[9px] text-white/25 normal-case tracking-normal ml-1">optional</span>
  </CardLabel>

  <label
    htmlFor="media-upload"
    className="block border border-dashed border-white/50 rounded-lg p-6 text-center cursor-pointer hover:border-white/25 hover:bg-white/2 transition-all"
  >
    {mediaPreview ? (
      <div className="flex flex-col items-center gap-2">
        <img
          src={mediaPreview}
          alt="Preview"
          className="max-h-40 rounded-lg object-contain border border-white/10"
        />
        <p className="font-mono text-[9px] text-white/40">{mediaFile?.name}</p>
        <p className="font-mono text-[9px] text-red-500 hover:text-red-300">Click to change</p>
      </div>
    ) : (
      <>
        <div className="w-9 h-9 bg-black/35 dark:bg-[#1a1a18] border border-white/8 rounded-lg flex items-center justify-center mx-auto mb-2 dark:text-white/35">
          <ImageTwoToneIcon />
        </div>
        <p className="text-[12px] text-white/45 mb-1">Drop photo here or click to browse</p>
        <p className="font-mono text-[9px] text-white/25">JPG · PNG · WEBP · MAX 50MB · AUTO-ENCRYPTED</p>
      </>
    )}
  </label>

  <input
    id="media-upload"
    type="file"
    accept="image/jpeg,image/png,image/webp"
    className="hidden"
    onChange={handleMediaChange}
  />

  {mediaFile && (
    <button
      onClick={() => { setMediaFile(null); setMediaPreview(null); setForm((prev) => ({ ...prev, evidenceMedia: null})) }}
      className="mt-2 w-full py-2 rounded-lg border border-white/8 text-[11px] font-bold dark:text-white/40 hover:text-white/60 hover:border-white/20 transition-all cursor-pointer bg-transparent"
    >
      Remove image 
    </button>
  )}
</Card>
    </>,

    // 04 SUBMIT
    <Card>
      <CardLabel>Report settings</CardLabel>
      {toggleSettings.map(({ label, desc, val, toggle }, i) => (
        <div key={label} className={`flex items-center justify-between py-3 gap-4 ${i > 0 ? "border-t border-white/6" : ""}`}>
          <div>
            <p className="text-[13px] font-bold text-black/60 dark:text-[#f5f4ef] mb-[2px]">{label}</p>
            <p className="text-[11px] text-black/40 dark:text-white/35 leading-[1.5]">{desc}</p>
          </div>
          <Toggle on={val} onToggle={toggle} />
        </div>
      ))}
    </Card>,
  ];
  
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        
        /* MUI stepper overrides */
        .report-stepper .MuiStepLabel-label {
          font-family: 'Space Mono', monospace !important;
          font-size: 9px !important;
          letter-spacing: 0.1em !important;
          font-weight: 700 !important;
          color: rgba(0,0,0,0.35) !important;
          }
        .report-stepper .MuiStepLabel-label.Mui-active {
          color: #ef4444 !important;
          }
        .report-stepper .MuiStepLabel-label.Mui-completed {
          color: rgba(0,0,0,0.55) !important;
          }
        .report-stepper .MuiStepIcon-root {
          color: rgba(0,0,0,0.18) !important;
          }
        .report-stepper .MuiStepIcon-root.Mui-active {
          color: #ef4444 !important;
          }
        .report-stepper .MuiStepIcon-root.Mui-completed {
          color: rgba(0,0,0,0.35) !important;
          }
        .report-stepper .MuiStepConnector-line {
          border-color: rgba(0,0,0,0.12) !important;
          }
        .report-stepper .MuiStepContent-root {
          border-color: rgba(0,0,0,0.12) !important;
          margin-left: 12px !important;
          padding-left: 20px !important;
          }
        .dark .report-stepper .MuiStepLabel-label {
          color: rgba(255,255,255,0.3) !important;
          }
        .dark .report-stepper .MuiStepContent-root {
          border-color: rgba(255,255,255,0.08) !important;
          margin-left: 12px !important;
          padding-left: 20px !important;
        }
        .dark .report-stepper .MuiStepLabel-label.Mui-active {
          color: #ef4444 !important;
          }
        .dark .report-stepper .MuiStepLabel-label.Mui-completed {
          color: rgba(255,255,255,0.55) !important;
          }
        .dark .report-stepper .MuiStepIcon-root {
          color: rgba(255,255,255,0.08) !important;
          }
        .dark .report-stepper .MuiStepIcon-root.Mui-active {
          color: #ef4444 !important;
          }
        .dark .report-stepper .MuiStepIcon-root.Mui-completed {
          color: rgba(255,255,255,0.25) !important;
          }
        .dark .report-stepper .MuiStepConnector-line {
          border-color: rgba(255,255,255,0.08) !important;
        }
      `}</style>

      <div className="dark:text-[#f5f4ef] min-h-screen">
        <div className="max-w-3xl mx-auto pb-16">
          {submitted ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-5 text-teal-500">
                <IconCheck />
              </div>
              <h2 className="text-[1.5rem] font-extrabold tracking-[-0.04em] mb-3">Report submitted</h2>
              <p className="text-[13px] dark:text-white/45 leading-[1.7] max-w-sm mx-auto mb-6">
                Your report has been encrypted and forwarded to verified response units. 
                {update &&
                <>You will receive a status update within 15 minutes.</>}
              </p>
              <span className="font-mono text-[11px] dark:bg-[#111110] border dark:border-white/8 rounded-lg px-5 py-2 inline-block mb-6">
                {refNo}
              </span>
              <br />
              <button
                onClick={() => { setSubmitted(false); setActiveStep(0); resetForm(); setUpdate(false); }}
                className="bg-red-500 hover:bg-red-600 active:scale-[0.98] dark:text-white font-extrabold text-[14px] tracking-[-0.02em] px-8 py-3.25 rounded-lg border-none cursor-pointer transition-all"
              >
                Submit another report
              </button>
              <p className="font-mono text-[9px] dark:text-white/25 mt-4 tracking-[0.04em]">
                REPORT ANONYMISED.
              </p>
            </div>
          ) : 
          (
            <>
              <div className="my-10">
                <div className="flex items-center gap-2 mb-3">
                  <PulsingDot color="bg-black dark:bg-red-500" />
                  <span className="font-mono text-[9px] tracking-[0.12em] text-black dark:text-red-500 uppercase">
                    Submit incident report
                  </span>
                </div>
                <h1 className="text-[1.8rem] font-extrabold tracking-[-0.04em] leading-[1.1] mb-2">
                  What did you witness?
                </h1>
                <p className="text-[13px] dark:text-white/45 leading-[1.6]">
                  Your report is end-to-end encrypted. Location data is only shared with verified response teams.
                </p>
              </div>
              <Stepper activeStep={activeStep} orientation="vertical" className="report-stepper">
                {STEP_LABELS.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                    <StepContent>
                      <div className="pt-2">
                        {stepContent[index]}
                        <StepNav
                          step={index}
                          total={STEP_LABELS.length}
                          onBack={handleBack}
                          onNext={handleNext}
                        />
                        {index === STEP_LABELS.length - 1 && (
                          <p className="font-mono text-[9px] dark:text-white/25 mt-3 tracking-[0.04em]">
                            END-TO-END ENCRYPTED · YOUR IDENTITY IS PROTECTED
                          </p>
                        )}
                      </div>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </>
          )}
        </div>
      </div>
    </>
  );
}