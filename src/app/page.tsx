import { EasterEggs } from "@/components/layout/EasterEggs";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cover } from "@/components/sections/Cover";
import { HighStandards } from "@/components/sections/high-standards/HighStandards";
import { HowWeSucceed } from "@/components/sections/how-we-succeed/HowWeSucceed";
import { ThePromise } from "@/components/sections/promise/ThePromise";
import { ShapeTheCode } from "@/components/sections/shape/ShapeTheCode";
import { Statement } from "@/components/sections/Statement";
import { Open } from "@/components/sections/values/Open";
import { Proactive } from "@/components/sections/values/Proactive";
import { Together } from "@/components/sections/values/Together";
import { WhoWeAre } from "@/components/sections/who-we-are/WhoWeAre";
import { YouBelongHere } from "@/components/sections/you-belong/YouBelongHere";
import { AdminBar } from "@/components/stories/AdminBar";
import { ShareStoryDialog } from "@/components/stories/ShareStoryDialog";
import { StoriesProvider } from "@/components/stories/StoriesProvider";
import { StoryModal } from "@/components/stories/StoryModal";

export default function Home() {
  return (
    <MotionProvider>
      <SmoothScroll>
        <StoriesProvider>
          <SiteNav />
          <main id="main">
            <Cover />
            <Statement />
            <WhoWeAre />
            <YouBelongHere />
            <HighStandards />
            <HowWeSucceed />
            <Together />
            <Open />
            <Proactive />
            <ThePromise />
            <ShapeTheCode />
          </main>
          <SiteFooter />
          <ShareStoryDialog />
          <StoryModal />
          <AdminBar />
          <EasterEggs />
        </StoriesProvider>
      </SmoothScroll>
    </MotionProvider>
  );
}
