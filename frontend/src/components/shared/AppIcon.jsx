import IconActivity from "@devigner-ui/icons/Activity";
import IconAlertTriangle from "@devigner-ui/icons/AlertTriangle";
import IconArrowDown from "@devigner-ui/icons/ArrowDown";
import IconArrowRight from "@devigner-ui/icons/ArrowRight";
import IconBag2 from "@devigner-ui/icons/Bag2";
import IconBottle from "@devigner-ui/icons/Bottle";
import IconCalendar from "@devigner-ui/icons/Calendar";
import IconCamera from "@devigner-ui/icons/Camera";
import IconCameraAdd from "@devigner-ui/icons/CameraAdd";
import IconCard from "@devigner-ui/icons/Card";
import IconChartSquare from "@devigner-ui/icons/ChartSquare";
import IconChatRoundDots from "@devigner-ui/icons/ChatRoundDots";
import IconCheckCircle from "@devigner-ui/icons/CheckCircle";
import IconClock from "@devigner-ui/icons/Clock";
import IconClose from "@devigner-ui/icons/Close";
import IconCloseCircle from "@devigner-ui/icons/CloseCircle";
import IconClipboardList from "@devigner-ui/icons/ClipboardList";
import IconDocumentText from "@devigner-ui/icons/DocumentText";
import IconFaceScanSquare from "@devigner-ui/icons/FaceScanSquare";
import IconGallery from "@devigner-ui/icons/Gallery";
import IconHamburgerMenu from "@devigner-ui/icons/HamburgerMenu";
import IconHome from "@devigner-ui/icons/Home";
import IconLeaf from "@devigner-ui/icons/Leaf";
import IconLogout from "@devigner-ui/icons/Logout";
import IconMedicalKit from "@devigner-ui/icons/MedicalKit";
import IconMagnifer from "@devigner-ui/icons/Magnifer";
import IconMoon from "@devigner-ui/icons/Moon";
import IconPen from "@devigner-ui/icons/Pen";
import IconSettings from "@devigner-ui/icons/Settings";
import IconShield from "@devigner-ui/icons/Shield";
import IconShieldCheck from "@devigner-ui/icons/ShieldCheck";
import IconStar from "@devigner-ui/icons/Star";
import IconStethoscope from "@devigner-ui/icons/Stethoscope";
import IconSun from "@devigner-ui/icons/Sun";
import IconTrashBin2 from "@devigner-ui/icons/TrashBin2";
import IconUpload from "@devigner-ui/icons/Upload";
import IconUser from "@devigner-ui/icons/User";
import IconUserRounded from "@devigner-ui/icons/UserRounded";
import IconUsersGroupRounded from "@devigner-ui/icons/UsersGroupRounded";
import IconVideocamera from "@devigner-ui/icons/Videocamera";
import IconWallet2 from "@devigner-ui/icons/Wallet2";
import IconWaterdrop from "@devigner-ui/icons/Waterdrop";

const ICONS = {
  activity: IconActivity,
  alert: IconAlertTriangle,
  arrowDown: IconArrowDown,
  arrowRight: IconArrowRight,
  bag: IconBag2,
  bottle: IconBottle,
  calendar: IconCalendar,
  camera: IconCamera,
  cameraAdd: IconCameraAdd,
  card: IconCard,
  chart: IconChartSquare,
  chat: IconChatRoundDots,
  check: IconCheckCircle,
  clock: IconClock,
  close: IconClose,
  closeCircle: IconCloseCircle,
  clipboard: IconClipboardList,
  document: IconDocumentText,
  drop: IconWaterdrop,
  faceScan: IconFaceScanSquare,
  gallery: IconGallery,
  menu: IconHamburgerMenu,
  home: IconHome,
  leaf: IconLeaf,
  logout: IconLogout,
  medicalKit: IconMedicalKit,
  search: IconMagnifer,
  moon: IconMoon,
  edit: IconPen,
  settings: IconSettings,
  shield: IconShield,
  shieldCheck: IconShieldCheck,
  star: IconStar,
  doctor: IconStethoscope,
  sun: IconSun,
  trash: IconTrashBin2,
  upload: IconUpload,
  user: IconUser,
  profile: IconUserRounded,
  users: IconUsersGroupRounded,
  video: IconVideocamera,
  wallet: IconWallet2,
};

const EMOJI_ICONS = {
  "📊": "chart", "👥": "users", "📅": "calendar", "🔍": "search",
  "🧴": "bottle", "⚙️": "settings", "🛡️": "shieldCheck", "🧑‍⚕️": "doctor",
  "👨‍⚕️": "doctor", "🩺": "doctor", "💳": "card", "🏠": "home",
  "📷": "camera", "📸": "cameraAdd", "🥗": "leaf", "📄": "document",
  "🛍️": "bag", "🙍‍♂️": "profile", "👤": "user", "👨": "user",
  "⏳": "clock", "⏱️": "clock", "⏰": "clock", "⏲️": "clock",
  "✅": "check", "✓": "check", "❌": "closeCircle", "✕": "closeCircle",
  "🔬": "activity", "🤖": "activity", "📋": "clipboard", "📃": "document",
  "🎥": "video", "📹": "video", "💬": "chat", "💊": "medicalKit",
  "🧼": "bottle", "🌿": "leaf", "💧": "drop", "✨": "star",
  "☀️": "sun", "🌙": "moon", "⚠️": "alert", "🔒": "shield",
  "📑": "clipboard", "🗑️": "trash", "📤": "upload", "🔄": "activity",
  "✏️": "edit", "🔗": "arrowRight", "🏥": "medicalKit", "💻": "activity",
  "🧾": "document", "🏦": "wallet", "📱": "card", "🚫": "closeCircle",
  "📵": "closeCircle", "📐": "faceScan", "💡": "activity", "💇": "user",
  "⚖️": "activity", "🎯": "faceScan", "⚡": "activity", "🚚": "bag",
  "🤔": "activity",
};

export default function AppIcon({ name, emoji, className = "", ...props }) {
  const Icon = ICONS[name || EMOJI_ICONS[emoji]] || IconActivity;
  return <Icon className={`ui-icon ${className}`.trim()} aria-hidden="true" {...props} />;
}
