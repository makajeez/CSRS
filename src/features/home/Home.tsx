import PinDropTwoTone from '@mui/icons-material/PinDropTwoTone';
import { NavLink } from 'react-router-dom';
import GPPMaybeTwoTone from '@mui/icons-material/GppMaybeTwoTone';
import QuestionAnswerTwoTone from '@mui/icons-material/QuestionAnswerTwoTone';
import SendTimeExtensionTwoTone from '@mui/icons-material/SendTimeExtensionTwoTone';
import TheaterComedyTwoTone from '@mui/icons-material/TheaterComedyTwoTone';
import PsychologyAltTwoToneIcon from '@mui/icons-material/PsychologyAltTwoTone';
import SportsKabaddiTwoToneIcon from '@mui/icons-material/SportsKabaddiTwoTone';
import PowerOffTwoToneIcon from '@mui/icons-material/PowerOffTwoTone';
import PersonOffTwoToneIcon from '@mui/icons-material/PersonOffTwoTone';
import TipsAndUpdatesTwoToneIcon from '@mui/icons-material/TipsAndUpdatesTwoTone';
import { PulsingDot } from '../shared/SharedUI';


const STEPS = [
  { num: "1", ml: "0px", mr: "150px" , Icon: PinDropTwoTone, colorClass: "dark:bg-red-500/10 dark:text-red-500", title: "Pinpoint the location", desc: "Drop a precise pin or use GPS auto-detect. Your report is tagged to an exact coordinate grid for responder routing." },
  { num: "2", ml: "50px", mr: "100px" ,Icon: GPPMaybeTwoTone, colorClass: "dark:bg-amber-400/10 dark:text-amber-400", title: "Classify the threat", desc: "Choose from structured threat categories. Add media evidence — photos, audio, or short video clips." },
  { num: "3", ml: "100px", mr: "50px" ,Icon: QuestionAnswerTwoTone, colorClass: "dark:bg-teal-500/10 dark:text-teal-400", title: "Community corroboration", desc: "Nearby users verify or add details. Reports gain credibility scores — multiple confirmations trigger priority alerts." },
  { num: "4", ml: "150px", mr: "0px" ,Icon: SendTimeExtensionTwoTone, colorClass: "dark:bg-blue-500/10 dark:text-blue-400", title: "Dispatch & resolution", desc: "Authorities and security agencies receive structured incident data. Status is fed back to reporters in real-time." },
];

const THREAT_TYPES = [
  { Icon: TheaterComedyTwoTone, iconColor: "text-red-500", iconBg: "bg-red-500/10", name: "Armed robbery", desc: "Active theft with weapons, vehicle snatching", count: "3,241 REPORTS THIS MONTH" },
  { Icon: PsychologyAltTwoToneIcon, iconColor: "text-amber-400", iconBg: "bg-amber-400/10", name: "Suspicious activity", desc: "Surveillance, loitering, unusual behaviour", count: "5,109 REPORTS THIS MONTH" },
  { Icon: SportsKabaddiTwoToneIcon, iconColor: "text-red-500", iconBg: "bg-red-500/10", name: "Civil unrest", desc: "Protests, riots, crowd flashpoints", count: "891 REPORTS THIS MONTH" },
  { Icon: PowerOffTwoToneIcon, iconColor: "text-blue-400", iconBg: "bg-blue-500/10", name: "Infrastructure threat", desc: "Road hazards, gas leaks, power failures", count: "2,447 REPORTS THIS MONTH" },
  { Icon: PersonOffTwoToneIcon, iconColor: "text-red-500", iconBg: "bg-red-500/10", name: "Missing persons", desc: "Kidnap alerts, missing child, abduction", count: "310 REPORTS THIS MONTH" },
  { Icon: TipsAndUpdatesTwoToneIcon, iconColor: "text-amber-400", iconBg: "bg-amber-400/10", name: "Pre-emptive intel", desc: "Planned attacks, early warning signals", count: "674 REPORTS THIS MONTH" },
];


const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-[15px] tracking-widest text-red-500/80 uppercase mb-6 pb-3 border-b border-red-500">
    {children}
  </p>
);



function Home() {


  return (
    <>
      <div className="font-syne dark:text-[#f5f4ef] min-h-screen">
        <div className="max-w-3xl mx-auto pb-16">

          <section className="pt-16 pb-12">
            <div className="flex items-center gap-2 font-mono-custom text-[10px] dark:text-amber-400 tracking-[0.12em] uppercase mb-5">
              <PulsingDot color="bg-amber-400" size="" />
              Real-time community intelligence
            </div>
            <h1 className="text-[clamp(2.4rem,6vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.04em] mb-6">
              Report threats.<br />
              Protect your <span className="dark:text-red-500">community.</span>
            </h1>
            <p className="text-[15px] dark:text-white/55 leading-[1.7] max-w-120 mb-10">
              A crowdsourced platform where citizens report security threats, suspicious activity, and safety risks — in real-time, before incidents escalate.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <NavLink to="/report" >
                <button className="dark:bg-red-500 hover:bg-red-600 active:scale-[0.98] dark:text-white font-bold text-[14px] px-7 py-3.25 rounded-lg border-none cursor-pointer transition-all duration-150">
                  Submit a report
                </button>
              </NavLink>
            </div>
          </section>

          <div className="grid grid-cols-3 gap-px dark:bg-white/8 rounded-xl overflow-hidden mb-12">
            {[
              { n: "1.2", sup: "k", label: "REPORTS / MONTH" },
              { n: "8", sup: "min", label: "AVG RESPONSE TIME" },
              { n: "94", sup: "%", label: "VERIFIED REPORTS" },
            ].map(({ n, sup, label }) => (
              <div key={label} className="dark:bg-[#111110] py-5 px-4 text-center">
                <div className="text-[1.75rem] font-extrabold tracking-[-0.04em]">
                  {n}<span className="dark:text-red-500">{sup}</span>
                </div>
                <div className="font-mono-custom text-[10px] dark:text-white/40 mt-1 tracking-[0.06em]">{label}</div>
              </div>
            ))}
          </div>

          <SectionLabel>How it works</SectionLabel>
          <div className="flex flex-col gap-px rounded-xl overflow-hidden mb-12">
            {STEPS.map(({ num, mr, ml, Icon, colorClass, title, desc }) => (
              <div key={num} style={{marginLeft: ml, marginRight: mr }} className="dark:bg-[#111110] dark:hover:bg-[#838380] transition-colors duration-200 px-5 py-5 flex items-start gap-4">
                <span className="font-mono-custom text-[15px] dark:text-white/50 min-w-7 mt-0.75">{num}</span>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                  <Icon />
                </div>
                <div>
                  <div className="text-3.5 font-bold tracking-[-0.02em] text-[#f5f4ef] mb-1">{title}</div>
                  <div className="text-3.25 text-white/45 leading-[1.6]">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <SectionLabel>Threat categories</SectionLabel>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2 mb-12">
            {THREAT_TYPES.map(({ Icon, iconColor, iconBg, name, desc, count }) => (
              <div
                key={name}
                className="bg-[#111110] border border-white/8 hover:border-white/18 hover:bg-[#161614] rounded-[10px] p-4 cursor-pointer transition-all duration-200"
              >
                <div className={`w-8 h-8 rounded-[7px] flex items-center justify-center mb-[0.6rem] ${iconBg} ${iconColor}`}>
                  <Icon />
                </div>
                <div className="text-[13px] font-bold tracking-[-0.01em] text-[#f5f4ef] mb-0.75">{name}</div>
                <div className="text-[11px] text-white/38 leading-normal">{desc}</div>
                <div className="font-mono-custom text-[9px] text-white/25 mt-2">{count}</div>
              </div>
            ))}
          </div>



          <footer className="pt-8 mt-4 border-t border-white/8 flex justify-between items-center flex-wrap gap-4">
            <span className="font-mono-custom text-[10px] text-white/22">© 2026 CROWDSOURCE · COMMUNITY SECURITY PLATFORM</span>
            <span className="font-mono-custom text-[10px] text-white/22">END-TO-END ENCRYPTED · ANONYMOUS REPORTING</span>
          </footer>

        </div>
      </div>
    </>
  );
}

export default Home;