import NetflixLogo from "@/components/logo/netflix";
import SpotifyLogo from "@/components/logo/spotify";
import YoutubeLogo from "@/components/logo/youtube";
import AppleLogo from "@/components/logo/apple";
import GameLogo from "@/components/logo/game";
import AdobeLogo from "@/components/logo/adobe";
import FigmaLogo from "@/components/logo/figma";
import CanvaLogo from "@/components/logo/canva";
import NotionLogo from "@/components/logo/notion";
import HuluLogo from "@/components/logo/hulu";
import AdobeXdLogo from "@/components/logo/adobe-xd";
import GodaddyLogo from "@/components/logo/godaddy";
import OpenaiLogo from "@/components/logo/openai";
import UdacityLogo from "@/components/logo/udacity";
import AWSLogo from "@/components/logo/aws";
import PerplexityLogo from "@/components/logo/perplexity";
import UdemyLogo from "@/components/logo/udemy";
import VercelLogo from "@/components/logo/vercel";
import WebflowLogo from "@/components/logo/webflow";
import DisneyPlusLogo from "@/components/logo/disney-plus";
import LinkedInLogo from "@/components/logo/linkedin";
import TwitchLogo from "@/components/logo/twitch";
import KickLogo from "@/components/logo/kick";
import PremiereLogo from "@/components/logo/premiere";
import StabilityAiLogo from "@/components/logo/stability-ai";
import FirebaseLogo from "@/components/logo/firebase";
import MongoDBLogo from "@/components/logo/mongodb";
import IllustratorLogo from "@/components/logo/illustrator";
import PhotoshopLogo from "@/components/logo/photoshop";
import LightRoomLogo from "@/components/logo/light-room";
import GamePlatformsLogo from "@/components/logo/game"; // Example for games
import { CircleArrowOutUpRight } from "lucide-react";

const platformOptions = [
  {
    value: "netflix",
    label: "Netflix",
    icon: NetflixLogo,
    category: "Entertainment",
  },
  {
    value: "spotify",
    label: "Spotify",
    icon: SpotifyLogo,
    category: "Entertainment",
  },
  {
    value: "youtube",
    label: "YouTube",
    icon: YoutubeLogo,
    category: "Entertainment",
  },
  {
    value: "apple",
    label: "Apple",
    icon: AppleLogo,
    category: "Entertainment",
  },
  { value: "games", label: "Games", icon: GameLogo, category: "Entertainment" },
  { value: "adobe", label: "Adobe", icon: AdobeLogo, category: "Design" },
  {
    value: "adobe-xd",
    label: "Adobe XD",
    icon: AdobeXdLogo,
    category: "Design",
  },
  { value: "figma", label: "Figma", icon: FigmaLogo, category: "Design" },
  { value: "canva", label: "Canva", icon: CanvaLogo, category: "Design" },
  {
    value: "notion",
    label: "Notion",
    icon: NotionLogo,
    category: "Productivity",
  },
  { value: "hulu", label: "Hulu", icon: HuluLogo, category: "Entertainment" },
  {
    value: "godaddy",
    label: "GoDaddy",
    icon: GodaddyLogo,
    category: "Hosting",
  },
  { value: "openai", label: "OpenAI", icon: OpenaiLogo, category: "AI" },
  {
    value: "udacity",
    label: "Udacity",
    icon: UdacityLogo,
    category: "Education",
  },
  { value: "aws", label: "AWS", icon: AWSLogo, category: "Hosting" },
  {
    value: "perplexity",
    label: "Perplexity",
    icon: PerplexityLogo,
    category: "AI",
  },
  { value: "udemy", label: "Udemy", icon: UdemyLogo, category: "Education" },
  { value: "vercel", label: "Vercel", icon: VercelLogo, category: "Hosting" },
  { value: "webflow", label: "Webflow", icon: WebflowLogo, category: "Design" },
  {
    value: "disney-plus",
    label: "Disney+",
    icon: DisneyPlusLogo,
    category: "Entertainment",
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: LinkedInLogo,
    category: "Social",
  },
  {
    value: "twitch",
    label: "Twitch",
    icon: TwitchLogo,
    category: "Entertainment",
  },
  { value: "kick", label: "Kick", icon: KickLogo, category: "Entertainment" },
  {
    value: "premiere",
    label: "Premiere Pro",
    icon: PremiereLogo,
    category: "Design",
  },
  {
    value: "stability-ai",
    label: "Stability AI",
    icon: StabilityAiLogo,
    category: "AI",
  },
  {
    value: "firebase",
    label: "Firebase",
    icon: FirebaseLogo,
    category: "Hosting",
  },
  {
    value: "mongodb",
    label: "MongoDB",
    icon: MongoDBLogo,
    category: "Database",
  },
  {
    value: "illustrator",
    label: "Illustrator",
    icon: IllustratorLogo,
    category: "Design",
  },
  {
    value: "photoshop",
    label: "Photoshop",
    icon: PhotoshopLogo,
    category: "Design",
  },
  {
    value: "light-room",
    label: "Light Room",
    icon: LightRoomLogo,
    category: "Design",
  },
  {
    value: "other",
    label: "Other",
    icon: CircleArrowOutUpRight,
    category: "Other",
  },
];

export default platformOptions;
